import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Volume2, Sparkles, Zap, ArrowLeftRight, Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ANTONYM_PAIRS } from '../../data/antonymsData';
import { audioService } from '../../utils/audio';

interface AntonymsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AntonymsModal: React.FC<AntonymsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz'>('explore');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'HSK 1' | 'HSK 2'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quiz Mode State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerEvaluated, setIsAnswerEvaluated] = useState(false);

  // Generate shuffled question for current quiz round
  const currentQuizItem = useMemo(() => {
    const list = ANTONYM_PAIRS;
    const pair = list[quizIndex % list.length];
    // Randomize whether wordA is prompt or wordB is prompt
    const isAtoB = quizIndex % 2 === 0;
    const promptWord = isAtoB ? pair.wordA : pair.wordB;
    const correctWord = isAtoB ? pair.wordB : pair.wordA;

    // Distractors from other pairs
    const otherWords: typeof promptWord[] = [];
    for (const p of list) {
      if (p.id !== pair.id) {
        otherWords.push(p.wordA, p.wordB);
      }
    }
    // Pick 3 random distinct distractors
    const shuffledOthers = otherWords
      .filter((w) => w.hanzi !== correctWord.hanzi && w.hanzi !== promptWord.hanzi)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [correctWord, ...shuffledOthers].sort(() => Math.random() - 0.5);

    return {
      pair,
      promptWord,
      correctWord,
      options,
    };
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
    let list = ANTONYM_PAIRS;

    if (selectedLevel !== 'all') {
      list = list.filter((p) => p.level === selectedLevel);
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter(
      (p) =>
        p.wordA.hanzi.includes(q) ||
        p.wordA.pinyin.toLowerCase().includes(q) ||
        p.wordA.meaning.toLowerCase().includes(q) ||
        p.wordB.hanzi.includes(q) ||
        p.wordB.pinyin.toLowerCase().includes(q) ||
        p.wordB.meaning.toLowerCase().includes(q) ||
        p.contrastSentence.hanzi.includes(q) ||
        p.contrastSentence.meaning.toLowerCase().includes(q) ||
        p.tip.toLowerCase().includes(q)
    );
  }, [selectedLevel, searchQuery]);

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.playClick();
    audioService.speakChinese(text);
  };

  const handleSelectQuizOption = (hanzi: string) => {
    if (isAnswerEvaluated) return;
    setSelectedAnswer(hanzi);
    setIsAnswerEvaluated(true);

    const isCorrect = hanzi === currentQuizItem.correctWord.hanzi;
    if (isCorrect) {
      audioService.playSuccessChime();
      audioService.speakChinese(currentQuizItem.correctWord.hanzi);
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
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-xs">
              <ArrowLeftRight className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Cặp Từ Trái Nghĩa Tiếng Trung (反义词)</h3>
              <p className="text-[11px] text-slate-400">24 Cặp từ đối lập HSK 1 - 2 & Quiz luyện phản xạ tốc độ</p>
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

        {/* Tab Switcher: Explore vs Reflex Quiz */}
        <div className="p-3 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-750 text-xs font-bold w-full max-w-xs">
            <button
              data-testid="antonyms-tab-explore"
              onClick={() => {
                audioService.playClick();
                setActiveTab('explore');
              }}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'explore'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📖 Tra cứu ({ANTONYM_PAIRS.length})</span>
            </button>
            <button
              data-testid="antonyms-tab-quiz"
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
              <span>Luyện phản xạ</span>
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

        {/* Tab 1: Explore Pairs */}
        {activeTab === 'explore' && (
          <>
            {/* Filters & Search */}
            <div className="p-3 bg-slate-850/50 border-b border-slate-800 space-y-2 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-750 text-xs font-semibold shrink-0">
                  <button
                    data-testid="filter-antonym-level-all"
                    onClick={() => {
                      audioService.playClick();
                      setSelectedLevel('all');
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedLevel === 'all'
                        ? 'bg-teal-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tất cả (24)
                  </button>
                  <button
                    data-testid="filter-antonym-level-hsk1"
                    onClick={() => {
                      audioService.playClick();
                      setSelectedLevel('HSK 1');
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedLevel === 'HSK 1'
                        ? 'bg-teal-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    HSK 1 (10)
                  </button>
                  <button
                    data-testid="filter-antonym-level-hsk2"
                    onClick={() => {
                      audioService.playClick();
                      setSelectedLevel('HSK 2');
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedLevel === 'HSK 2'
                        ? 'bg-teal-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    HSK 2 (14)
                  </button>
                </div>

                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    data-testid="antonyms-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm chữ Hán, pinyin hoặc nghĩa (to, nhỏ, mua, bán...)"
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-teal-500"
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

            {/* Pairs List */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Phương pháp học từ vựng theo cặp đối lập (反义词):</div>
                  <div className="text-[11px] opacity-90 mt-0.5">
                    Não bộ ghi nhớ từ vựng nhanh gấp 2 lần khi đặt các khái niệm đối lập cạnh nhau (To ↔️ Nhỏ, Nhanh ↔️ Chậm, Mua ↔️ Bán). Chạm vào từng từ hoặc câu ví dụ để nghe phát âm chuẩn giọng bản xứ.
                  </div>
                </div>
              </div>

              {filteredPairs.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  Không tìm thấy cặp từ trái nghĩa nào khớp với &quot;{searchQuery}&quot;.
                </div>
              ) : (
                filteredPairs.map((pair) => (
                  <div
                    key={pair.id}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-all flex flex-col gap-2.5 shadow-xs"
                  >
                    {/* Level & Category badges */}
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                          {pair.level}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-750 text-slate-400 font-medium">
                          {pair.categoryName}
                        </span>
                      </div>
                    </div>

                    {/* Dual Cards Comparison */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Word A Card */}
                      <div
                        onClick={(e) => handleSpeak(e, pair.wordA.hanzi)}
                        className="p-3 rounded-2xl bg-slate-900 border border-teal-500/30 hover:border-teal-500/60 transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group shadow-xs active:scale-[0.98]"
                      >
                        <div className="text-3xl font-black text-teal-300 font-sans leading-none mb-1">
                          {pair.wordA.hanzi}
                        </div>
                        <div className="text-xs font-semibold text-rose-400 pinyin-text">
                          {pair.wordA.pinyin}
                        </div>
                        <div className="text-[10px] text-amber-300 uppercase font-bold tracking-tight">
                          {pair.wordA.hanviet}
                        </div>
                        <div className="text-xs text-slate-200 font-medium mt-0.5">
                          {pair.wordA.meaning}
                        </div>
                        <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 absolute top-2 right-2 transition-colors" />
                      </div>

                      {/* Word B Card */}
                      <div
                        onClick={(e) => handleSpeak(e, pair.wordB.hanzi)}
                        className="p-3 rounded-2xl bg-slate-900 border border-rose-500/30 hover:border-rose-500/60 transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group shadow-xs active:scale-[0.98]"
                      >
                        <div className="text-3xl font-black text-rose-300 font-sans leading-none mb-1">
                          {pair.wordB.hanzi}
                        </div>
                        <div className="text-xs font-semibold text-rose-400 pinyin-text">
                          {pair.wordB.pinyin}
                        </div>
                        <div className="text-[10px] text-amber-300 uppercase font-bold tracking-tight">
                          {pair.wordB.hanviet}
                        </div>
                        <div className="text-xs text-slate-200 font-medium mt-0.5">
                          {pair.wordB.meaning}
                        </div>
                        <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 absolute top-2 right-2 transition-colors" />
                      </div>
                    </div>

                    {/* Contrast Example Sentence */}
                    <div
                      onClick={(e) => handleSpeak(e, pair.contrastSentence.hanzi)}
                      className="p-2.5 rounded-xl bg-slate-850 border border-slate-750/70 hover:border-slate-700 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                      title="Bấm để nghe phát âm câu ví dụ đối chiếu"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-100 text-xs">
                          {pair.contrastSentence.hanzi}
                        </div>
                        <div className="text-[11px] text-rose-400/90 pinyin-text">
                          {pair.contrastSentence.pinyin}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {pair.contrastSentence.meaning}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="p-1.5 rounded-lg bg-slate-750 text-slate-300 hover:text-white shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Tip / Pitfall */}
                    <div className="p-2 rounded-xl bg-slate-850/80 text-[11px] text-slate-400 border border-slate-800 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{pair.tip}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Tab 2: Speed Reflex Quiz */}
        {activeTab === 'quiz' && (
          <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-750 text-center shadow-lg relative">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                Chọn từ trái nghĩa (反义词) tương ứng với:
              </div>

              {/* Target Word Display */}
              <div className="text-5xl font-black text-amber-400 font-sans mb-1">
                {currentQuizItem.promptWord.hanzi}
              </div>
              <div className="text-sm font-semibold text-rose-400 pinyin-text">
                {currentQuizItem.promptWord.pinyin}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Nghĩa: <span className="font-bold text-slate-100">{currentQuizItem.promptWord.meaning}</span>
              </div>

              <button
                type="button"
                onClick={(e) => handleSpeak(e, currentQuizItem.promptWord.hanzi)}
                className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe phát âm</span>
              </button>
            </div>

            {/* 4 Answer Options */}
            <div className="grid grid-cols-2 gap-2.5">
              {currentQuizItem.options.map((opt) => {
                const isSelected = selectedAnswer === opt.hanzi;
                const isCorrect = opt.hanzi === currentQuizItem.correctWord.hanzi;

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
                    key={opt.hanzi}
                    data-testid={`antonym-option-${opt.hanzi}`}
                    onClick={() => handleSelectQuizOption(opt.hanzi)}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center shadow-xs active:scale-[0.98] ${btnStyle}`}
                  >
                    <div className="text-2xl font-bold font-sans">{opt.hanzi}</div>
                    <div className="text-xs text-rose-400 font-medium pinyin-text">{opt.pinyin}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{opt.meaning}</div>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button */}
            {isAnswerEvaluated && (
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between gap-3 animate-fadeIn">
                <div className="text-xs">
                  {selectedAnswer === currentQuizItem.correctWord.hanzi ? (
                    <span className="font-bold text-emerald-400">
                      ✓ Chính xác! {currentQuizItem.promptWord.hanzi} ↔️ {currentQuizItem.correctWord.hanzi} (+10 điểm)
                    </span>
                  ) : (
                    <span className="font-bold text-rose-400">
                      ✗ Chưa đúng! Từ trái nghĩa là: {currentQuizItem.correctWord.hanzi} ({currentQuizItem.correctWord.pinyin} - {currentQuizItem.correctWord.meaning})
                    </span>
                  )}
                </div>

                <button
                  data-testid="antonym-next-btn"
                  onClick={handleNextQuizRound}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all active:scale-95 shrink-0 shadow-md shadow-amber-900/30"
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
          <span>Kỷ lục streak: {bestStreak} câu liên tiếp</span>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-all active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
