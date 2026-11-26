import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Volume2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Flame,
  Lightbulb,
  BookOpen,
  PenTool,
  Compass,
} from 'lucide-react';
import {
  POLYPHONIC_CHARACTERS,
  POLYPHONIC_QUIZ_LIST,
} from '../../data/polyphonicData';
import { audioService } from '../../utils/audio';

interface PolyphonicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
}

export const PolyphonicModal: React.FC<PolyphonicModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'contrast_sentences' | 'quiz'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('poly-chang-zhang');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Filtered characters
  const filteredList = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return POLYPHONIC_CHARACTERS;

    return POLYPHONIC_CHARACTERS.filter((item) => {
      const matchHanzi = item.hanzi.includes(term);
      const matchHanviet = item.hanviet.toLowerCase().includes(term);
      const matchTip = item.memoryTip.toLowerCase().includes(term);
      const matchReadings = item.readings.some(
        (r) =>
          r.pinyin.toLowerCase().includes(term) ||
          r.meaning.toLowerCase().includes(term) ||
          r.words.some((w) => w.includes(term))
      );
      const matchContrast =
        item.masterContrastSentence &&
        (item.masterContrastSentence.chinese.includes(term) ||
          item.masterContrastSentence.meaning.toLowerCase().includes(term));

      return matchHanzi || matchHanviet || matchTip || matchReadings || matchContrast;
    });
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakChinese(text);
  };

  const handleSelectQuizOption = (idx: number) => {
    if (isQuizChecked) return;
    setSelectedOption(idx);
    setIsQuizChecked(true);

    const currentQ = POLYPHONIC_QUIZ_LIST[quizIndex];
    if (idx === currentQ.correctIndex) {
      audioService.playSuccessChime();
      setQuizScore((prev) => prev + 10);
      setQuizStreak((prev) => prev + 1);
    } else {
      audioService.playErrorBuzz();
      setQuizStreak(0);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsQuizChecked(false);
    if (quizIndex + 1 < POLYPHONIC_QUIZ_LIST.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsQuizChecked(false);
    setQuizScore(0);
    setQuizStreak(0);
    setShowQuizResult(false);
  };

  const currentQuizItem = POLYPHONIC_QUIZ_LIST[quizIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-6 animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[92vh] max-h-[850px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
        data-testid="polyphonic-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm shadow-inner">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  Chữ Hán Đa Âm Tiết (多音字)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                  1 chữ nhiều âm
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Bí kíp phân biệt và phát âm chuẩn xác các chữ có nhiều cách đọc trong tiếng Trung
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            data-testid="close-polyphonic-modal-btn"
            className="p-2 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shrink-0">
          <button
            onClick={() => setActiveTab('cards')}
            data-testid="polyphonic-tab-cards"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'cards'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kho Chữ Đa Âm ({filteredList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contrast_sentences')}
            data-testid="polyphonic-tab-contrast"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'contrast_sentences'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Câu Lưỡng Âm Thần Thánh 🌟</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            data-testid="polyphonic-tab-quiz"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Đố Vui Phân Biệt Âm ⚡</span>
            {quizScore > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold">
                {quizScore}đ
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Kho Chữ Đa Âm */}
        {activeTab === 'cards' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm chữ Hán, Pinyin, Hán Việt, từ ghép (长, xíng, trường, ngân hàng)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredList.map((item) => {
                const isExpanded = expandedId === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all"
                  >
                    {/* Header Character Card */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-black text-3xl flex items-center justify-center shadow-inner">
                          {item.hanzi}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              Hán Việt: {item.hanviet}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200">
                              {item.readings.length} cách đọc
                            </span>
                          </div>
                          {/* Reading Pills */}
                          <div className="flex items-center gap-2 mt-1">
                            {item.readings.map((r, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-slate-100 dark:bg-slate-700 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-600"
                              >
                                {r.pinyin}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onSelectCharacter && (
                          <button
                            onClick={() => {
                              onSelectCharacter(item.hanzi);
                              onClose();
                            }}
                            title="Tập viết chữ này trong HanziWriter"
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors"
                          >
                            <PenTool className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                        >
                          {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                        </button>
                      </div>
                    </div>

                    {/* Master Contrast Sentence */}
                    {item.masterContrastSentence && (
                      <div className="mt-3.5 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                            🌟 Câu đối chiếu 2 cách đọc:
                          </span>
                          <button
                            onClick={(e) => handleSpeak(e, item.masterContrastSentence!.chinese)}
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-600"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.masterContrastSentence.chinese}
                        </div>
                        <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          {item.masterContrastSentence.pinyin}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 italic">
                          "{item.masterContrastSentence.meaning}"
                        </div>
                      </div>
                    )}

                    {/* Expanded Detail Readings */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-4 animate-fade-in">
                        {/* Memory Tip */}
                        <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 text-xs border border-violet-200 dark:border-violet-900/50 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>
                            <strong className="font-bold">Mẹo phân biệt nhanh:</strong>{' '}
                            {item.memoryTip}
                          </span>
                        </div>

                        {/* Readings Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.readings.map((r, rIdx) => (
                            <div
                              key={rIdx}
                              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-black text-amber-600 dark:text-amber-400">
                                    {r.pinyin}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                    {r.pos}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => handleSpeak(e, r.pinyin)}
                                  className="text-slate-400 hover:text-amber-600"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                👉 Nghĩa: {r.meaning}
                              </div>

                              {/* Collocations */}
                              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                <span className="text-[11px] text-slate-400">Từ ghép:</span>
                                {r.words.map((w, wIdx) => (
                                  <span
                                    key={wIdx}
                                    onClick={(e) => handleSpeak(e, w)}
                                    className="px-2 py-0.5 rounded-md text-xs font-medium bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-500 transition-colors"
                                  >
                                    {w}
                                  </span>
                                ))}
                              </div>

                              {/* Example */}
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-0.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {r.example.chinese}
                                  </span>
                                  <button
                                    onClick={(e) => handleSpeak(e, r.example.chinese)}
                                    className="text-slate-400 hover:text-amber-600"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="text-[11px] text-amber-600 dark:text-amber-400">
                                  {r.example.pinyin}
                                </div>
                                <div className="text-[11px] text-slate-500 italic">
                                  "{r.example.meaning}"
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Câu Lưỡng Âm Thần Thánh */}
        {activeTab === 'contrast_sentences' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
              💡 <strong>Phương pháp học tương phản:</strong> Ghi nhớ 1 câu chứa cả 2 cách phát âm
              khác nhau sẽ giúp não bộ khắc sâu ngữ cảnh sử dụng trọn đời!
            </div>

            <div className="space-y-3">
              {POLYPHONIC_CHARACTERS.map((char) => {
                if (!char.masterContrastSentence) return null;
                const sentence = char.masterContrastSentence;

                return (
                  <div
                    key={char.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-base flex items-center justify-center">
                          {char.hanzi}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {char.readings.map((r) => r.pinyin).join(' / ')}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleSpeak(e, sentence.chinese)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-200 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe câu mẫu</span>
                      </button>
                    </div>

                    <div className="text-base font-bold text-slate-900 dark:text-white pt-1">
                      {sentence.chinese}
                    </div>
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      {sentence.pinyin}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 italic">
                      "{sentence.meaning}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Đố Vui Phân Biệt Âm */}
        {activeTab === 'quiz' && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
            {showQuizResult ? (
              <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 text-center shadow-2xl space-y-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Hoàn Thành Thử Thách Đa Âm!
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Bạn đã phân biệt chuẩn xác các chữ có nhiều cách đọc
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-around">
                  <div>
                    <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      {quizScore}
                    </div>
                    <div className="text-xs text-slate-500">Tổng điểm</div>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <div className="text-2xl font-black text-orange-500">
                      {Math.round((quizScore / (POLYPHONIC_QUIZ_LIST.length * 10)) * 100)}%
                    </div>
                    <div className="text-xs text-slate-500">Độ chính xác</div>
                  </div>
                </div>

                <button
                  onClick={handleResetQuiz}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại từ đầu</span>
                </button>
              </div>
            ) : (
              <div className="w-full max-w-xl bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
                {/* Header & Streak */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Câu hỏi {quizIndex + 1} / {POLYPHONIC_QUIZ_LIST.length}
                  </span>

                  {quizStreak > 1 && (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{quizStreak} combo!</span>
                    </div>
                  )}
                </div>

                {/* Prompt & Sentence */}
                <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/60 space-y-2 text-center">
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    {currentQuizItem.prompt}
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white tracking-wide pt-1">
                    {currentQuizItem.sentence}
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3">
                  {currentQuizItem.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuizItem.correctIndex;

                    let btnClass =
                      'p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ';

                    if (!isQuizChecked) {
                      btnClass +=
                        'border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-950/30 text-slate-800 dark:text-slate-100';
                    } else if (isCorrect) {
                      btnClass +=
                        'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-100 font-bold';
                    } else if (isSelected) {
                      btnClass +=
                        'border-rose-500 bg-rose-100/70 dark:bg-rose-900/60 text-rose-950 dark:text-rose-100 font-bold';
                    } else {
                      btnClass +=
                        'border-slate-200 dark:border-slate-700 opacity-40 text-slate-600 dark:text-slate-400';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isQuizChecked}
                        onClick={() => handleSelectQuizOption(idx)}
                        className={btnClass}
                      >
                        <span className="text-lg font-bold">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isQuizChecked && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 animate-fade-in">
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      💡 <span className="font-bold">Giải thích:</span>{' '}
                      {currentQuizItem.explanation}
                    </div>

                    <button
                      onClick={handleNextQuiz}
                      className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>
                        {quizIndex + 1 < POLYPHONIC_QUIZ_LIST.length
                          ? 'Câu tiếp theo'
                          : 'Xem kết quả'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
