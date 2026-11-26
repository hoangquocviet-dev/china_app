import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Volume2, Sparkles, HelpCircle, AlertTriangle, Trophy, Zap, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CONFUSING_PAIRS } from '../../data/confusingWordsData';
import { audioService } from '../../utils/audio';

interface ConfusingWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfusingWordsModal: React.FC<ConfusingWordsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz'>('explore');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'HSK 1' | 'HSK 2'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerEvaluated, setIsAnswerEvaluated] = useState(false);

  const currentQuiz = useMemo(() => {
    const list = CONFUSING_PAIRS;
    return list[quizIndex % list.length];
  }, [quizIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredPairs = useMemo(() => {
    let list = CONFUSING_PAIRS;

    if (selectedLevel !== 'all') {
      list = list.filter((p) => p.level === selectedLevel);
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.wordA.hanzi.includes(q) ||
        p.wordA.meaning.toLowerCase().includes(q) ||
        p.wordB.hanzi.includes(q) ||
        p.wordB.meaning.toLowerCase().includes(q) ||
        p.coreDifference.toLowerCase().includes(q) ||
        p.goldenRule.toLowerCase().includes(q) ||
        p.examples.some(
          (ex) =>
            ex.correct.hanzi.includes(q) ||
            ex.correct.meaning.toLowerCase().includes(q) ||
            ex.wrong.hanzi.includes(q)
        )
    );
  }, [selectedLevel, searchQuery]);

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.playClick();
    audioService.speakChinese(text);
  };

  const handleSelectQuizOption = (opt: string) => {
    if (isAnswerEvaluated) return;
    setSelectedAnswer(opt);
    setIsAnswerEvaluated(true);

    const isCorrect = opt === currentQuiz.quizPrompt.correctAnswer;
    if (isCorrect) {
      audioService.playSuccessChime();
      audioService.speakChinese(currentQuiz.quizPrompt.sentence);
      setQuizScore((prev) => prev + 10);
      setQuizStreak((prev) => {
        const next = prev + 1;
        setBestStreak((b) => Math.max(b, next));
        if (next > 0 && next % 5 === 0) {
          confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.7 },
          });
        }
        return next;
      });
    } else {
      audioService.playErrorBuzz();
      setQuizStreak(0);
    }
  };

  const handleNextQuizRound = () => {
    audioService.playClick();
    setSelectedAnswer(null);
    setIsAnswerEvaluated(false);
    setQuizIndex((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-xs">
              <HelpCircle className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Bí Kíp Phân Biệt Từ Dễ Nhầm Lẫn (近义词辨析)</h3>
              <p className="text-[11px] text-slate-400">16 Cặp từ đồng nghĩa / gần nghĩa kinh điển HSK 1 - 2</p>
            </div>
          </div>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Explore vs Quick Quiz */}
        <div className="p-3 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-750 text-xs font-bold w-full max-w-xs">
            <button
              data-testid="confusing-tab-explore"
              onClick={() => {
                audioService.playClick();
                setActiveTab('explore');
              }}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'explore'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🔍 Phân biệt ({CONFUSING_PAIRS.length})</span>
            </button>
            <button
              data-testid="confusing-tab-quiz"
              onClick={() => {
                audioService.playClick();
                setActiveTab('quiz');
              }}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Luyện điền từ</span>
            </button>
          </div>

          {activeTab === 'quiz' && (
            <div className="flex items-center space-x-3 text-xs shrink-0">
              <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-750 text-amber-400 font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>{quizScore}đ</span>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-750 text-rose-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-rose-400" />
                <span>x{quizStreak}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: Explore & Study */}
        {activeTab === 'explore' && (
          <>
            {/* Filters & Search */}
            <div className="p-3 bg-slate-850/50 border-b border-slate-800 space-y-2 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-750 text-xs font-semibold shrink-0">
                  <button
                    data-testid="filter-confusing-level-all"
                    onClick={() => {
                      audioService.playClick();
                      setSelectedLevel('all');
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedLevel === 'all'
                        ? 'bg-violet-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tất cả (16)
                  </button>
                  <button
                    data-testid="filter-confusing-level-hsk1"
                    onClick={() => {
                      audioService.playClick();
                      setSelectedLevel('HSK 1');
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedLevel === 'HSK 1'
                        ? 'bg-violet-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    HSK 1 (9)
                  </button>
                  <button
                    data-testid="filter-confusing-level-hsk2"
                    onClick={() => {
                      audioService.playClick();
                      setSelectedLevel('HSK 2');
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedLevel === 'HSK 2'
                        ? 'bg-violet-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    HSK 2 (7)
                  </button>
                </div>

                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    data-testid="confusing-words-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo chữ Hán (二, 两, 认识...), pinyin hoặc nghĩa..."
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-violet-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Mẹo vàng tránh mất điểm trong các kỳ thi HSK:</div>
                  <div className="text-[11px] opacity-90 mt-0.5">
                    Các cặp từ gần nghĩa này là bẫy phổ biến nhất. Đọc kỹ phần so sánh Đúng (✓) vs Sai (✗) và bấm loa để nghe phát âm câu ví dụ chuẩn ngữ cảnh.
                  </div>
                </div>
              </div>

              {filteredPairs.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  Không tìm thấy cặp từ nào khớp với &quot;{searchQuery}&quot;.
                </div>
              ) : (
                filteredPairs.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-all flex flex-col gap-3 shadow-xs"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-sm">{item.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
                          {item.level}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-750 text-slate-400 font-medium">
                          {item.categoryName}
                        </span>
                      </div>
                    </div>

                    {/* Core Difference Box */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-750 text-slate-200 text-xs">
                      <span className="font-bold text-violet-400">Khác biệt cốt lõi: </span>
                      <span>{item.coreDifference}</span>
                    </div>

                    {/* Breakdown of Words */}
                    <div className="space-y-1.5">
                      <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750/70">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-base font-bold text-teal-400 font-sans">{item.wordA.hanzi}</span>
                          <span className="text-xs text-rose-400 font-semibold pinyin-text">{item.wordA.pinyin}</span>
                          <span className="text-[11px] text-slate-300 font-medium">— {item.wordA.meaning}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 leading-relaxed">{item.wordA.usageRule}</div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750/70">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-base font-bold text-amber-400 font-sans">{item.wordB.hanzi}</span>
                          <span className="text-xs text-rose-400 font-semibold pinyin-text">{item.wordB.pinyin}</span>
                          <span className="text-[11px] text-slate-300 font-medium">— {item.wordB.meaning}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 leading-relaxed">{item.wordB.usageRule}</div>
                      </div>

                      {item.wordC && (
                        <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750/70">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-base font-bold text-sky-400 font-sans">{item.wordC.hanzi}</span>
                            <span className="text-xs text-rose-400 font-semibold pinyin-text">{item.wordC.pinyin}</span>
                            <span className="text-[11px] text-slate-300 font-medium">— {item.wordC.meaning}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 leading-relaxed">{item.wordC.usageRule}</div>
                        </div>
                      )}
                    </div>

                    {/* Right vs Wrong Comparisons */}
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                        So sánh ví dụ chuẩn (Đúng ✓ vs Sai ✗):
                      </div>
                      {item.examples.map((ex, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-750 space-y-1.5">
                          {/* Correct Example */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-1.5 flex-1 min-w-0">
                              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                              <div>
                                <div className="font-bold text-emerald-300 text-xs">{ex.correct.hanzi}</div>
                                <div className="text-[10px] text-rose-400/90 pinyin-text">{ex.correct.pinyin}</div>
                                <div className="text-[11px] text-slate-300">{ex.correct.meaning}</div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleSpeak(e, ex.correct.hanzi)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0"
                              title="Nghe phát âm câu đúng"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Wrong Example */}
                          <div className="flex items-start space-x-1.5 text-[11px] pt-1 border-t border-slate-800">
                            <span className="text-rose-400 font-bold shrink-0">✗</span>
                            <div>
                              <span className="line-through text-rose-300/80 mr-1.5">{ex.wrong.hanzi}</span>
                              <span className="text-slate-500">({ex.wrong.explanation})</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Golden Rule Tip */}
                    <div className="p-2 rounded-xl bg-amber-500/10 text-[11px] text-amber-300/90 border border-amber-500/20 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-400">Quy tắc vàng ghi nhớ: </span>
                        <span>{item.goldenRule}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Tab 2: Fill-in-the-Blank Practice Quiz */}
        {activeTab === 'quiz' && (
          <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-750 text-center shadow-lg relative">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                Chọn từ thích hợp điền vào chỗ trống:
              </div>

              {/* Blank Sentence Display */}
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-sans mb-2 px-2">
                {currentQuiz.quizPrompt.blankSentence}
              </div>

              <div className="text-xs text-slate-300">
                Chủ đề phân biệt: <span className="font-bold text-violet-300">{currentQuiz.title}</span>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
              {currentQuiz.quizPrompt.options.map((opt) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === currentQuiz.quizPrompt.correctAnswer;

                let btnStyle = 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-100';
                if (isAnswerEvaluated) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-850 border-slate-800 opacity-50';
                  }
                }

                return (
                  <button
                    key={opt}
                    data-testid={`confusing-option-${opt}`}
                    onClick={() => handleSelectQuizOption(opt)}
                    className={`py-3 px-4 rounded-2xl border transition-all flex flex-col items-center justify-center text-center shadow-xs active:scale-[0.98] ${btnStyle}`}
                  >
                    <div className="text-xl font-bold font-sans">{opt}</div>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button */}
            {isAnswerEvaluated && (
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                <div className="text-xs">
                  <div className="font-bold mb-1">
                    {selectedAnswer === currentQuiz.quizPrompt.correctAnswer ? (
                      <span className="text-emerald-400">✓ Hoàn toàn chính xác! (+10 điểm)</span>
                    ) : (
                      <span className="text-rose-400">✗ Chưa đúng! Đáp án là: {currentQuiz.quizPrompt.correctAnswer}</span>
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px]">{currentQuiz.quizPrompt.explanation}</div>
                </div>

                <button
                  data-testid="confusing-next-btn"
                  onClick={handleNextQuizRound}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all active:scale-95 shrink-0 shadow-md shadow-violet-900/30"
                >
                  <span>Câu tiếp theo</span>
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Kỷ lục chuỗi đúng: {bestStreak} câu</span>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all active:scale-95"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
