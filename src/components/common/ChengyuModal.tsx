import React, { useState, useMemo } from 'react';
import { X, Search, Volume2, Sparkles, BookOpen, HelpCircle, CheckCircle2, RotateCcw, PenTool, Flame } from 'lucide-react';
import { CHENGYU_LIST } from '../../data/chengyuData';
import { audioService } from '../../utils/audio';

interface ChengyuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
}

export const ChengyuModal: React.FC<ChengyuModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz'>('explore');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);

  // Filtered list
  const filteredList = useMemo(() => {
    return CHENGYU_LIST.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchCat;

      const matchSearch =
        item.hanzi.includes(term) ||
        item.pinyin.toLowerCase().includes(term) ||
        item.hanviet.toLowerCase().includes(term) ||
        item.literalMeaning.toLowerCase().includes(term) ||
        item.figurativeMeaning.toLowerCase().includes(term) ||
        item.storyOrigin.toLowerCase().includes(term) ||
        item.exampleSentence.hanzi.includes(term) ||
        item.exampleSentence.vietnamese.toLowerCase().includes(term);

      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  const currentQuizItem = CHENGYU_LIST[currentQuizIndex % CHENGYU_LIST.length];

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakChinese(text);
  };

  const handleSelectQuizOption = (char: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(char);
    setIsAnswerChecked(true);

    const isCorrect = char === currentQuizItem.missingCharQuiz.correctChar;
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
    setCurrentQuizIndex((prev) => (prev + 1) % CHENGYU_LIST.length);
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizStreak(0);
  };

  const handlePracticeWriting = (char: string) => {
    if (onSelectCharacter) {
      onSelectCharacter(char);
      onClose();
    }
  };

  // Render question string with blank
  const renderQuizPrompt = () => {
    const chars = Array.from(currentQuizItem.hanzi);
    const mIdx = currentQuizItem.missingCharQuiz.missingIndex;
    return chars.map((c, idx) => (
      <span
        key={idx}
        className={`inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl mx-1 font-bold text-xl sm:text-2xl shadow-sm border ${
          idx === mIdx
            ? isAnswerChecked
              ? selectedOption === currentQuizItem.missingCharQuiz.correctChar
                ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300'
                : 'bg-rose-600/30 border-rose-400 text-rose-300'
              : 'bg-amber-500/20 border-amber-400/80 text-amber-300 border-dashed animate-pulse'
            : 'bg-slate-800 border-slate-700 text-slate-100'
        }`}
      >
        {idx === mIdx ? (isAnswerChecked ? currentQuizItem.missingCharQuiz.correctChar : '?') : c}
      </span>
    ));
  };

  return (
    <div
      role="dialog"
      data-testid="chengyu-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xs">
              🏮
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Kho Tàng Thành Ngữ Hán - Việt 4 Chữ & Điển Cố</h3>
              <p className="text-[11px] text-slate-400">24 Thành ngữ kinh điển, ngụ ngôn lịch sử & nghệ thuật dùng từ</p>
            </div>
          </div>
          <button
            data-testid="close-chengyu-modal-btn"
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

        {/* Tab switcher */}
        <div className="px-4 py-2 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-750 text-xs font-semibold">
            <button
              data-testid="tab-chengyu-explore"
              onClick={() => {
                audioService.playClick();
                setActiveTab('explore');
              }}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'explore'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Khám phá Thành ngữ ({CHENGYU_LIST.length})</span>
            </button>
            <button
              data-testid="tab-chengyu-quiz"
              onClick={() => {
                audioService.playClick();
                setActiveTab('quiz');
              }}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Đố Vui Điền Chữ 🏮</span>
            </button>
          </div>

          {activeTab === 'quiz' && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {quizScore} điểm
              </span>
              {quizStreak > 1 && (
                <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-bold flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3 fill-rose-400" /> {quizStreak} streak
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
                  data-testid="chengyu-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo thành ngữ, Hán Việt, Pinyin, nghĩa (vd: Mã đáo, ếch, 盲人摸象, ku jin)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
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
                  { id: 'fables_origins', label: 'Ngụ ngôn & Điển cố' },
                  { id: 'diligence_study', label: 'Học tập & Kiên trì' },
                  { id: 'wisdom_life', label: 'Trí tuệ & Cuộc sống' },
                  { id: 'emotion_relationships', label: 'Tình cảm & Lối sống' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      audioService.playClick();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors font-medium border ${
                      selectedCategory === cat.id
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                        : 'bg-slate-800/80 text-slate-400 border-slate-750 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Chengyu Cards */}
            <div className="p-3.5 flex-1 overflow-y-auto space-y-3.5 text-xs">
              {filteredList.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p>Không tìm thấy thành ngữ nào khớp với "{searchTerm}".</p>
                </div>
              ) : (
                filteredList.map((item) => (
                  <div
                    key={item.id}
                    data-testid={`chengyu-card-${item.hanzi}`}
                    className="p-4 rounded-2xl bg-slate-850/95 border border-slate-750 hover:border-slate-700 transition-all shadow-xs space-y-3"
                  >
                    {/* Top Row: 4 Character Tiles + Audio & Info */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center space-x-3">
                        {/* 4 character tiles */}
                        <div className="flex items-center space-x-1 shrink-0">
                          {Array.from(item.hanzi).map((char, cIdx) => (
                            <div
                              key={cIdx}
                              onClick={(e) => handleSpeak(e, char)}
                              className="w-8 h-9 sm:w-9 sm:h-10 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 hover:border-rose-500/40 flex items-center justify-center text-base sm:text-lg font-bold text-slate-100 font-sans cursor-pointer transition-transform active:scale-95"
                              title={`Bấm để nghe phát âm chữ [${char}]`}
                            >
                              {char}
                            </div>
                          ))}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 flex-wrap gap-y-0.5">
                            <span className="text-xs text-rose-400 font-bold pinyin-text">
                              {item.pinyin}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-extrabold uppercase tracking-wide">
                              {item.hanviet}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">
                              {item.categoryLabel}
                            </span>
                          </div>
                          <div className="text-xs text-slate-200 font-bold mt-1">
                            {item.figurativeMeaning}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={(e) => handleSpeak(e, item.hanzi)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Phát âm cả thành ngữ"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Literal Meaning Bar */}
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-750 flex items-center space-x-2 text-[11px]">
                      <span className="text-slate-400 shrink-0 font-medium">Nghĩa đen:</span>
                      <span className="text-slate-300 italic">{item.literalMeaning}</span>
                    </div>

                    {/* Story Origin Card */}
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/25 space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-amber-300 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Điển tích & Câu chuyện lịch sử:</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {item.storyOrigin}
                      </p>
                      {item.moralLesson && (
                        <div className="text-[10px] text-amber-400/90 font-medium pt-1 border-t border-amber-500/15">
                          💡 <strong>Bài học nhân sinh:</strong> {item.moralLesson}
                        </div>
                      )}
                    </div>

                    {/* Example Sentence with Audio */}
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-bold text-slate-100 font-sans truncate">
                          {item.exampleSentence.hanzi}
                        </div>
                        <div className="text-[10px] text-rose-400/90 pinyin-text truncate">
                          {item.exampleSentence.pinyin}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.exampleSentence.vietnamese}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleSpeak(e, item.exampleSentence.hanzi)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors shrink-0"
                        title="Nghe câu ví dụ"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Practice Writing Option */}
                    {onSelectCharacter && (
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        <span>Luyện viết chữ trong thành ngữ này:</span>
                        <div className="flex items-center space-x-1">
                          {Array.from(item.hanzi).map((char, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => handlePracticeWriting(char)}
                              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                              title={`Tập viết nét chữ [${char}]`}
                            >
                              <PenTool className="w-2.5 h-2.5" />
                              <span>{char}</span>
                            </button>
                          ))}
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
                <span>Câu đố {currentQuizIndex + 1} / {CHENGYU_LIST.length}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {currentQuizItem.categoryLabel}
                </span>
              </div>

              {/* Riddle Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/20 via-slate-850 to-slate-900 border border-rose-500/30 text-center space-y-3">
                <div className="flex items-center justify-center space-x-2 text-rose-400 font-bold text-xs">
                  <HelpCircle className="w-4 h-4" />
                  <span>Điền chữ còn thiếu vào thành ngữ:</span>
                </div>

                {/* Big Hanzi Prompt */}
                <div className="py-2 flex items-center justify-center">
                  {renderQuizPrompt()}
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  Âm Hán Việt: <strong className="text-amber-300 uppercase">{currentQuizItem.hanviet}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-750 text-slate-300 text-xs italic">
                  Ý nghĩa: "{currentQuizItem.figurativeMeaning}"
                </div>
              </div>

              {/* 4 Option Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                {currentQuizItem.missingCharQuiz.options.map((charOption, oIdx) => {
                  const isSelected = selectedOption === charOption;
                  const isCorrect = charOption === currentQuizItem.missingCharQuiz.correctChar;

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
                      key={oIdx}
                      data-testid={`chengyu-option-${charOption}`}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectQuizOption(charOption)}
                      className={`p-3.5 rounded-2xl border transition-all text-center flex items-center justify-center gap-2 ${btnStyle}`}
                    >
                      <span className="text-xl sm:text-2xl font-bold font-sans">
                        {charOption}
                      </span>
                      {isAnswerChecked && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon answer */}
              {isAnswerChecked && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-fadeIn space-y-1 ${
                  selectedOption === currentQuizItem.missingCharQuiz.correctChar
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="font-bold flex items-center justify-between">
                    <span>
                      {selectedOption === currentQuizItem.missingCharQuiz.correctChar ? '🎉 Hoàn toàn chính xác!' : 'Chưa đúng rồi!'}
                    </span>
                    <span className="text-amber-300 font-sans font-bold">
                      {currentQuizItem.hanzi} ({currentQuizItem.pinyin})
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    <strong>{currentQuizItem.hanviet}</strong>: {currentQuizItem.figurativeMeaning}
                  </div>
                </div>
              )}
            </div>

            {/* Quiz Footer actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleResetQuiz}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại từ đầu</span>
              </button>

              {isAnswerChecked && (
                <button
                  data-testid="next-chengyu-quiz-btn"
                  onClick={handleNextQuizQuestion}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all active:scale-95 shadow-md shadow-rose-950/40"
                >
                  Câu tiếp theo →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>{CHENGYU_LIST.length} Thành ngữ 4 chữ mẫu HSK 1 - 2</span>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
