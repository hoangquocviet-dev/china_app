import React, { useState, useMemo } from 'react';
import { X, Search, Volume2, Sparkles, BookOpen, HelpCircle, CheckCircle2, RotateCcw, PenTool } from 'lucide-react';
import { HANZI_DECOMPOSITION_LIST } from '../../data/decompositionData';
import { audioService } from '../../utils/audio';

interface HanziDecompositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
  initialHanzi?: string;
}

export const HanziDecompositionModal: React.FC<HanziDecompositionModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
  initialHanzi,
}) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz'>('explore');
  const [searchTerm, setSearchTerm] = useState(() => {
    if (initialHanzi && HANZI_DECOMPOSITION_LIST.some((item) => item.hanzi === initialHanzi)) {
      return initialHanzi;
    }
    return '';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);

  // Filtered list
  const filteredList = useMemo(() => {
    return HANZI_DECOMPOSITION_LIST.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchCat;

      const matchSearch =
        item.hanzi.includes(term) ||
        item.pinyin.toLowerCase().includes(term) ||
        item.hanviet.toLowerCase().includes(term) ||
        item.meaning.toLowerCase().includes(term) ||
        item.mnemonicStory.toLowerCase().includes(term) ||
        item.formula.toLowerCase().includes(term) ||
        item.components.some((c) => c.component.includes(term) || c.meaning.toLowerCase().includes(term));

      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  // Quiz questions
  const quizQuestions = useMemo(() => {
    return HANZI_DECOMPOSITION_LIST.map((correctItem, idx) => {
      // 3 distractors
      const others = HANZI_DECOMPOSITION_LIST.filter((_, i) => i !== idx);
      const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [correctItem, ...shuffledOthers].sort(() => 0.5 - Math.random());

      return {
        id: correctItem.id,
        target: correctItem,
        question: `Chữ nào được cấu tạo từ: ${correctItem.formula}?`,
        hint: correctItem.mnemonicStory,
        options,
      };
    });
  }, []);

  const currentQuestion = quizQuestions[currentQuizIndex % quizQuestions.length];

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakChinese(text);
  };

  const handleSelectQuizOption = (optionHanzi: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(optionHanzi);
    setIsAnswerChecked(true);

    const isCorrect = optionHanzi === currentQuestion.target.hanzi;
    if (isCorrect) {
      audioService.playSuccessChime();
      setQuizScore((prev) => prev + 10);
      setQuizStreak((prev) => prev + 1);
    } else {
      audioService.playErrorBuzz();
      setQuizStreak(0);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCurrentQuizIndex((prev) => (prev + 1) % quizQuestions.length);
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizStreak(0);
  };

  const handlePracticeWriting = (hanzi: string) => {
    if (onSelectCharacter) {
      onSelectCharacter(hanzi);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      data-testid="decomposition-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Chiết Tự Chữ Hán & Bí Quyết Nhớ Nhanh</h3>
              <p className="text-[11px] text-slate-400">Phân tách bộ phận & Câu chuyện liên tưởng nhớ sâu trọn đời</p>
            </div>
          </div>
          <button
            data-testid="close-decomposition-modal-btn"
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

        {/* Tab switcher: Khám phá vs Đố vui */}
        <div className="px-4 py-2 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-750 text-xs font-semibold">
            <button
              data-testid="tab-decomposition-explore"
              onClick={() => {
                audioService.playClick();
                setActiveTab('explore');
              }}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'explore'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Khám phá Chiết tự ({HANZI_DECOMPOSITION_LIST.length})</span>
            </button>
            <button
              data-testid="tab-decomposition-quiz"
              onClick={() => {
                audioService.playClick();
                setActiveTab('quiz');
              }}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Đố Vui Ghép Chữ 🧩</span>
            </button>
          </div>

          {activeTab === 'quiz' && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {quizScore} điểm
              </span>
              {quizStreak > 1 && (
                <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-bold animate-pulse">
                  🔥 {quizStreak} streak
                </span>
              )}
            </div>
          )}
        </div>

        {/* TAB 1: EXPLORE */}
        {activeTab === 'explore' && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Search and Category Filters */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  data-testid="decomposition-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo chữ Hán, Pinyin, Hán Việt, nghĩa (vd: 休, xiu, nghỉ, người, mộc)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-[11px]">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'compound_classic', label: 'Hội ý kinh điển' },
                  { id: 'mind_emotion', label: 'Tâm trí & Cảm xúc' },
                  { id: 'human_life', label: 'Con người & Đời sống' },
                  { id: 'nature_elements', label: 'Thiên nhiên & Vũ trụ' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      audioService.playClick();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors font-medium border ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-slate-800/80 text-slate-400 border-slate-750 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Decomposition Cards */}
            <div className="p-3.5 flex-1 overflow-y-auto space-y-3 text-xs">
              {filteredList.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p>Không tìm thấy chữ Hán nào phù hợp với từ khóa "{searchTerm}".</p>
                </div>
              ) : (
                filteredList.map((item) => (
                  <div
                    key={item.id}
                    data-testid={`decomposition-card-${item.hanzi}`}
                    className="p-3.5 rounded-2xl bg-slate-850/90 border border-slate-750 hover:border-slate-700 transition-all shadow-xs space-y-2.5"
                  >
                    {/* Top row: Big Character, Pinyin, Sino-Vietnamese, Meaning */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-2xl font-bold text-amber-300 font-sans shadow-xs">
                          {item.hanzi}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-slate-100">{item.hanzi}</span>
                            <span className="text-xs text-rose-400 font-medium pinyin-text">
                              {item.pinyin}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                              {item.hanviet}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-semibold">
                              {item.hskLevel}
                            </span>
                          </div>
                          <div className="text-xs text-slate-300 font-medium mt-0.5">
                            {item.meaning}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={(e) => handleSpeak(e, item.hanzi)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
                          title="Phát âm chữ này"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        {onSelectCharacter && (
                          <button
                            data-testid={`practice-writing-${item.hanzi}`}
                            onClick={() => handlePracticeWriting(item.hanzi)}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95"
                            title="Tập viết chữ này trong bàn vẽ"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Tập viết</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Formula Bar */}
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-between flex-wrap gap-1 text-[11px]">
                      <span className="text-slate-400 font-medium">Công thức chiết tự:</span>
                      <span className="font-bold text-amber-300 tracking-wide font-mono">
                        {item.formula} = {item.hanzi}
                      </span>
                    </div>

                    {/* Component Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                      {item.components.map((comp, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-200 font-bold flex items-center justify-center text-xs">
                              {comp.component}
                            </span>
                            <div>
                              <span className="font-bold text-slate-200">{comp.name}</span>
                              <span className="text-rose-400/80 ml-1 font-mono text-[10px]">({comp.pinyin})</span>
                            </div>
                          </div>
                          <span className="text-slate-400 text-[10px]">{comp.meaning}</span>
                        </div>
                      ))}
                    </div>

                    {/* Mnemonic Story Box */}
                    <div className="p-3 rounded-xl bg-amber-950/15 border border-amber-500/25 space-y-1">
                      <div className="flex items-center space-x-1.5 text-amber-300 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Bí quyết ghi nhớ liên tưởng:</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {item.mnemonicStory}
                      </p>
                      {item.culturalNote && (
                        <p className="text-[10px] text-slate-400 italic pt-1 border-t border-amber-500/10">
                          💡 {item.culturalNote}
                        </p>
                      )}
                    </div>

                    {/* Example Word */}
                    {item.exampleWord && (
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        <span>Từ mẫu thông dụng:</span>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-200">{item.exampleWord.word}</span>
                          <span className="text-rose-400 pinyin-text">({item.exampleWord.pinyin})</span>
                          <span>: {item.exampleWord.meaning}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: QUIZ */}
        {activeTab === 'quiz' && (
          <div className="p-4 flex-1 overflow-y-auto flex flex-col justify-between text-xs space-y-4">
            <div className="space-y-4">
              {/* Question header */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Câu đố {currentQuizIndex + 1} / {quizQuestions.length}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {currentQuestion.target.categoryLabel}
                </span>
              </div>

              {/* Riddle Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-850 to-slate-900 border border-amber-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                  <HelpCircle className="w-4 h-4" />
                  <span>Đố bạn chữ gì?</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-100">
                  {currentQuestion.question}
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-750 text-slate-300 text-xs italic leading-relaxed">
                  " {currentQuestion.hint} "
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-2.5">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.hanzi;
                  const isCorrect = option.hanzi === currentQuestion.target.hanzi;

                  let btnStyle = 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-slate-600';
                  if (isAnswerChecked) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold';
                    } else {
                      btnStyle = 'bg-slate-850/50 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      data-testid={`quiz-option-${option.hanzi}`}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectQuizOption(option.hanzi)}
                      className={`p-3 rounded-2xl border transition-all text-left flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center text-lg font-bold text-amber-300">
                          {option.hanzi}
                        </span>
                        <div>
                          <div className="font-bold text-slate-100 text-xs">{option.hanzi} ({option.pinyin})</div>
                          <div className="text-[10px] text-slate-400">{option.hanviet} • {option.meaning}</div>
                        </div>
                      </div>
                      {isAnswerChecked && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation on answer */}
              {isAnswerChecked && (
                <div className={`p-3 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
                  selectedOption === currentQuestion.target.hanzi
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="font-bold mb-0.5">
                    {selectedOption === currentQuestion.target.hanzi ? '🎉 Chính xác!' : 'Chưa đúng rồi!'} Đáp án đúng là chữ 【{currentQuestion.target.hanzi}】 ({currentQuestion.target.pinyin})
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Công thức: <strong>{currentQuestion.target.formula}</strong> = {currentQuestion.target.hanzi} ({currentQuestion.target.meaning})
                  </div>
                </div>
              )}
            </div>

            {/* Quiz Footer actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleResetQuiz}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại từ đầu</span>
              </button>

              {isAnswerChecked && (
                <button
                  data-testid="next-quiz-btn"
                  onClick={handleNextQuizQuestion}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all active:scale-95 shadow-md shadow-amber-950/40"
                >
                  Câu tiếp theo →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>{HANZI_DECOMPOSITION_LIST.length} chữ Hán chiết tự mẫu HSK 1 - 2</span>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
