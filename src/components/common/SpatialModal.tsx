import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Volume2,
  Sparkles,
  RotateCcw,
  Compass,
  ArrowRight,
  Flame,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  PenTool,
  CheckCircle2,
  XCircle,
  MapPin,
  Navigation,
} from 'lucide-react';
import {
  DIRECTION_WORDS,
  POSITION_STRUCTURES,
  EXISTENTIAL_PATTERNS,
  SPATIAL_MISTAKE_RULES,
  SPATIAL_QUIZ_QUESTIONS,
  DirectionWord,
} from '../../data/spatialData';
import { audioService } from '../../utils/audio';

interface SpatialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
}

export const SpatialModal: React.FC<SpatialModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'directions' | 'existential' | 'rules' | 'quiz'>('directions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWord, setSelectedWord] = useState<DirectionWord>(DIRECTION_WORDS[0]);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Filtered words
  const filteredWords = useMemo(() => {
    return DIRECTION_WORDS.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchCat;

      const matchSearch =
        item.hanzi.toLowerCase().includes(term) ||
        item.pinyin.toLowerCase().includes(term) ||
        item.vietnamese.toLowerCase().includes(term) ||
        item.variants.some((v) => v.toLowerCase().includes(term));

      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakChinese(text);
  };

  const handleSelectQuizOption = (idx: number) => {
    if (isQuizChecked) return;
    setSelectedOption(idx);
    setIsQuizChecked(true);

    const currentQ = SPATIAL_QUIZ_QUESTIONS[quizIndex];
    if (idx === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 10);
      setQuizStreak((prev) => prev + 1);
    } else {
      setQuizStreak(0);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex + 1 < SPATIAL_QUIZ_QUESTIONS.length) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsQuizChecked(false);
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

  const currentQ = SPATIAL_QUIZ_QUESTIONS[quizIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 border border-teal-100 dark:border-teal-900/40 rounded-2xl sm:rounded-3xl w-full max-w-4xl h-[94dvh] sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-white/20 rounded-xl backdrop-blur-md shadow-inner shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin-slow" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-xl font-bold tracking-tight truncate">Phương Vị Từ & Câu Tồn Hiện</h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-white/25 rounded-full uppercase tracking-wider shrink-0">
                  方位词与存现句
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-teal-100 mt-0.5 truncate">
                16 phương vị từ, la bàn không gian, câu tồn hiện V+着/了 và 4 đại kỵ HSK 2 - 3
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 active:scale-90 rounded-xl transition-all touch-manipulation shrink-0 ml-2"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 px-3 sm:px-4 pt-1.5 sm:pt-2 gap-1.5 sm:gap-2 overflow-x-auto touch-pan-x shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('directions')}
            className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap touch-manipulation active:scale-95 ${
              activeTab === 'directions'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-gray-900 shadow-sm font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Navigation className="w-4 h-4 shrink-0" />
            La Bàn & 16 Phương Vị
          </button>
          <button
            onClick={() => setActiveTab('existential')}
            className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap touch-manipulation active:scale-95 ${
              activeTab === 'existential'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-gray-900 shadow-sm font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            Câu Tồn Hiện (存现句)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap touch-manipulation active:scale-95 ${
              activeTab === 'rules'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-gray-900 shadow-sm font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            4 Đại Kỵ
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap touch-manipulation active:scale-95 ${
              activeTab === 'quiz'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-gray-900 shadow-sm font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            Đố Vui Điền Câu ⚡
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-6 space-y-4 sm:space-y-6">
          {/* TAB 1: DIRECTIONS & COMPASS */}
          {activeTab === 'directions' && (
            <div className="space-y-6">
              {/* Interactive Mini Compass Map */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 via-emerald-50/40 to-cyan-50 dark:from-teal-950/20 dark:via-gray-800 dark:to-cyan-950/20 border border-teal-100 dark:border-teal-900/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">
                      Sa Bàn Định Hướng Không Gian 8 Phương 4 Hướng
                    </h3>
                  </div>
                  <span className="text-xs text-teal-600 dark:text-teal-400 font-medium bg-teal-100/60 dark:bg-teal-900/40 px-2.5 py-0.5 rounded-full">
                    Chạm nút để xem chi tiết
                  </span>
                </div>

                <div className="grid grid-cols-3 max-w-sm mx-auto gap-2.5 text-center py-2">
                  <div />
                  <button
                    onClick={() => {
                      const w = DIRECTION_WORDS.find((d) => d.id === 'bei') || DIRECTION_WORDS[0];
                      setSelectedWord(w);
                      audioService.speakChinese(w.hanzi);
                    }}
                    className={`min-h-[52px] p-2.5 rounded-xl border transition-all text-xs font-semibold active:scale-95 touch-manipulation flex flex-col items-center justify-center ${
                      selectedWord.id === 'bei'
                        ? 'bg-teal-600 text-white shadow-md border-teal-600 scale-105'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-400 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div>⬆️ 北 (Bắc)</div>
                    <div className="text-[10px] opacity-80">běi</div>
                  </button>
                  <div />

                  <button
                    onClick={() => {
                      const w = DIRECTION_WORDS.find((d) => d.id === 'xi') || DIRECTION_WORDS[0];
                      setSelectedWord(w);
                      audioService.speakChinese(w.hanzi);
                    }}
                    className={`min-h-[52px] p-2.5 rounded-xl border transition-all text-xs font-semibold active:scale-95 touch-manipulation flex flex-col items-center justify-center ${
                      selectedWord.id === 'xi'
                        ? 'bg-teal-600 text-white shadow-md border-teal-600 scale-105'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-400 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div>⬅️ 西 (Tây)</div>
                    <div className="text-[10px] opacity-80">xī</div>
                  </button>

                  <button
                    onClick={() => {
                      const w = DIRECTION_WORDS.find((d) => d.id === 'zhongjian') || DIRECTION_WORDS[0];
                      setSelectedWord(w);
                      audioService.speakChinese(w.hanzi);
                    }}
                    className={`min-h-[52px] p-2.5 rounded-xl border transition-all text-xs font-bold active:scale-95 touch-manipulation flex flex-col items-center justify-center ${
                      selectedWord.id === 'zhongjian'
                        ? 'bg-emerald-600 text-white shadow-md border-emerald-600 scale-105'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    <div>🎯 中间</div>
                    <div className="text-[10px] opacity-80">Ở Giữa</div>
                  </button>

                  <button
                    onClick={() => {
                      const w = DIRECTION_WORDS.find((d) => d.id === 'dong') || DIRECTION_WORDS[0];
                      setSelectedWord(w);
                      audioService.speakChinese(w.hanzi);
                    }}
                    className={`min-h-[52px] p-2.5 rounded-xl border transition-all text-xs font-semibold active:scale-95 touch-manipulation flex flex-col items-center justify-center ${
                      selectedWord.id === 'dong'
                        ? 'bg-teal-600 text-white shadow-md border-teal-600 scale-105'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-400 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div>➡️ 东 (Đông)</div>
                    <div className="text-[10px] opacity-80">dōng</div>
                  </button>

                  <div />
                  <button
                    onClick={() => {
                      const w = DIRECTION_WORDS.find((d) => d.id === 'nan') || DIRECTION_WORDS[0];
                      setSelectedWord(w);
                      audioService.speakChinese(w.hanzi);
                    }}
                    className={`min-h-[52px] p-2.5 rounded-xl border transition-all text-xs font-semibold active:scale-95 touch-manipulation flex flex-col items-center justify-center ${
                      selectedWord.id === 'nan'
                        ? 'bg-teal-600 text-white shadow-md border-teal-600 scale-105'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-400 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div>⬇️ 南 (Nam)</div>
                    <div className="text-[10px] opacity-80">nán</div>
                  </button>
                  <div />
                </div>
              </div>

              {/* Search & Categories Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm phương vị (Thượng, Hạ, Đông, Tây, 上, 下...)"
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto touch-pan-x pb-1 sm:pb-0 scrollbar-none">
                  {[
                    { id: 'all', label: 'Tất cả (16)' },
                    { id: 'vertical', label: 'Cao thấp' },
                    { id: 'horizontal', label: 'Trước sau / Trái phải' },
                    { id: 'depth', label: 'Trong ngoài' },
                    { id: 'relative', label: 'Tương quan' },
                    { id: 'cardinal', label: 'Đông Tây Nam Bắc' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`min-h-[40px] px-3.5 py-2 text-xs rounded-xl font-semibold whitespace-nowrap transition-all touch-manipulation active:scale-95 flex items-center ${
                        selectedCategory === cat.id
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direction Word Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWords.map((word) => {
                  const isSelected = selectedWord.id === word.id;
                  return (
                    <div
                      key={word.id}
                      onClick={() => {
                        setSelectedWord(word);
                        audioService.speakChinese(word.hanzi);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 shadow-md ring-1 ring-teal-500'
                          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/60 hover:border-teal-300 dark:hover:border-teal-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{word.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold font-kai text-teal-800 dark:text-teal-300">
                                {word.hanzi}
                              </span>
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                {word.pinyin}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {word.vietnamese}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleSpeak(e, word.hanzi)}
                            className="min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300 transition-all touch-manipulation active:scale-90"
                            title="Phát âm từ"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          {onSelectCharacter && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCharacter(word.hanzi);
                                onClose();
                              }}
                              className="min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 transition-all touch-manipulation active:scale-90"
                              title="Tập viết chữ này"
                            >
                              <PenTool className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Variants */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {word.variants.map((v, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            {v}
                          </span>
                        ))}
                      </div>

                      {/* Usage Tip */}
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-amber-50/60 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-100/80 dark:border-amber-900/30">
                        💡 <span className="font-semibold text-amber-800 dark:text-amber-300">Mẹo dùng:</span>{' '}
                        {word.usageTip}
                      </p>

                      {/* Example */}
                      <div className="mt-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {word.example.sentence}
                          </span>
                          <button
                            onClick={(e) => handleSpeak(e, word.example.sentence)}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-teal-100/60 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 active:scale-90 touch-manipulation transition-all ml-2"
                            title="Nghe câu ví dụ"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-[11px] text-teal-700 dark:text-teal-400 font-mono mt-0.5">
                          {word.example.pinyin}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {word.example.vietnamese}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: EXISTENTIAL PATTERNS & POSITIONS */}
          {activeTab === 'existential' && (
            <div className="space-y-6">
              {/* Introduction Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 dark:from-teal-950/30 dark:via-gray-800 dark:to-emerald-950/30 border border-teal-200 dark:border-teal-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-600 text-white rounded-xl shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                      Bản Chất Câu Tồn Hiện Trong Tiếng Trung (存现句)
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                      Câu tồn hiện dùng để biểu đạt sự <strong>tồn tại</strong>, <strong>xuất hiện</strong> hoặc{' '}
                      <strong>mất đi</strong> của người/vật tại một địa điểm không gian. Điểm đặc biệt nhất: Nơi chốn
                      đóng vai trò là <strong>chủ ngữ đứng đầu câu</strong>, phía sau động từ là một đối tượng mới hoặc
                      chưa xác định!
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Core Position Sentence Types */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  3 Mẫu Câu Biểu Thị Vị Trí Cơ Bản (在 - 有 - 是)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {POSITION_STRUCTURES.map((st) => (
                    <div
                      key={st.id}
                      className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-teal-700 dark:text-teal-300 uppercase tracking-wide">
                          {st.name}
                        </div>
                        <div className="mt-1.5 p-2 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/30 text-xs font-mono font-semibold text-teal-800 dark:text-teal-200">
                          {st.formula}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                          {st.explanation}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700 space-y-1.5">
                        {st.examples.slice(0, 2).map((ex, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex items-center justify-between font-medium text-gray-800 dark:text-gray-200">
                              <span>{ex.chinese}</span>
                              <button
                                onClick={(e) => handleSpeak(e, ex.chinese)}
                                className="text-teal-600 hover:scale-110 transition-transform ml-1"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">{ex.vietnamese}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2 Core Existential Patterns: V+着 vs V+了 */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  2 Mẫu Câu Tồn Hiện Trọng Điểm Đề Thi HSK
                </h4>
                <div className="space-y-4">
                  {EXISTENTIAL_PATTERNS.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-white dark:bg-gray-800 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                        <div>
                          <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100">{p.title}</h5>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            {p.verbType}
                          </span>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                          {p.formula}
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                        {p.explanation}
                      </p>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {p.examples.map((ex, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold text-gray-900 dark:text-gray-100 text-sm">
                              <span>{ex.chinese}</span>
                              <button
                                onClick={(e) => handleSpeak(e, ex.chinese)}
                                className="text-emerald-600 hover:scale-110 transition-transform ml-2"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">
                              {ex.pinyin}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">{ex.vietnamese}</div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-1.5 rounded border border-gray-100 dark:border-gray-700 font-mono mt-1">
                              🔍 {ex.breakdown}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 4 GOLDEN RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>
                  <strong>Lưu ý quan trọng:</strong> 4 đại kỵ dưới đây chiếm đến 85% các câu bẫy ngữ pháp về phương vị
                  từ và câu tồn hiện trong các đề thi HSK 2, 3 và 4!
                </span>
              </div>

              <div className="space-y-4">
                {SPATIAL_MISTAKE_RULES.map((rule, idx) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                      <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      {rule.title}
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                      {rule.ruleDescription}
                    </p>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Wrong box */}
                      <div className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                        <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-bold mb-1">
                          <XCircle className="w-4 h-4" />
                          <span>Mẫu sai kinh điển:</span>
                        </div>
                        <div className="font-mono text-gray-800 dark:text-gray-200 font-semibold">
                          {rule.wrongExample}
                        </div>
                        <div className="text-[11px] text-red-600 dark:text-red-400 mt-1 italic">
                          Lý do sai: {rule.whyWrong}
                        </div>
                      </div>

                      {/* Correct box */}
                      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                        <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mẫu đúng chuẩn:</span>
                          </div>
                          <button
                            onClick={(e) => handleSpeak(e, rule.correctExample)}
                            className="text-emerald-600 hover:scale-110 transition-transform"
                            title="Nghe câu đúng"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                          {rule.correctExample}
                        </div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                          {rule.pinyin}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{rule.vietnamese}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {!showQuizResult ? (
                <div className="max-w-2xl mx-auto space-y-4">
                  {/* Score & Streak Header */}
                  <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 rounded-xl border border-teal-200/60 dark:border-teal-800/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Câu hỏi:</span>
                      <span className="px-2 py-0.5 rounded-md bg-teal-600 text-white font-bold text-xs">
                        {quizIndex + 1} / {SPATIAL_QUIZ_QUESTIONS.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold">
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
                        <span>Combo: {quizStreak}</span>
                      </div>
                      <div className="text-teal-700 dark:text-teal-300 font-mono">
                        Điểm: {quizScore}
                      </div>
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm space-y-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {currentQ.prompt}
                    </div>

                    {currentQ.sentence && (
                      <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/60 space-y-1">
                        <div className="flex items-center justify-between font-bold text-base text-teal-800 dark:text-teal-300 font-kai">
                          <span>{currentQ.sentence}</span>
                          <button
                            onClick={(e) => handleSpeak(e, currentQ.sentence)}
                            className="text-teal-600 dark:text-teal-400 hover:scale-110 transition-transform ml-2"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-teal-600 dark:text-teal-400 font-mono">{currentQ.pinyin}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{currentQ.vietnamese}</div>
                      </div>
                    )}

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {currentQ.options.map((opt, idx) => {
                        let btnStyle =
                          'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-teal-400 text-gray-800 dark:text-gray-200';
                        if (isQuizChecked) {
                          if (idx === currentQ.correctIndex) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                          } else if (idx === selectedOption) {
                            btnStyle = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 line-through';
                          } else {
                            btnStyle = 'opacity-40 border-gray-200 dark:border-gray-700';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectQuizOption(idx)}
                            disabled={isQuizChecked}
                            className={`min-h-[50px] p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all active:scale-[0.98] touch-manipulation flex items-center justify-between shadow-xs ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isQuizChecked && idx === currentQ.correctIndex && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-1.5" />
                            )}
                            {isQuizChecked && idx === selectedOption && idx !== currentQ.correctIndex && (
                              <XCircle className="w-5 h-5 text-red-600 shrink-0 ml-1.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {isQuizChecked && (
                      <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs sm:text-sm text-teal-900 dark:text-teal-200 animate-fadeIn">
                        <div className="font-bold mb-1 flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
                          <Lightbulb className="w-4 h-4" />
                          <span>Giải thích chi tiết:</span>
                        </div>
                        <p className="leading-relaxed">{currentQ.explanation}</p>
                      </div>
                    )}
                  </div>

                  {/* Next Question Button */}
                  {isQuizChecked && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleNextQuizQuestion}
                        className="min-h-[48px] w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 touch-manipulation"
                      >
                        <span>{quizIndex + 1 < SPATIAL_QUIZ_QUESTIONS.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Quiz Result Scorecard */
                <div className="max-w-md mx-auto text-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl space-y-4 animate-scaleUp">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                    <Compass className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Hoàn Thành Đố Vui Phương Vị!
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Bạn đã chinh phục hệ thống câu hỏi về vị trí và câu tồn hiện
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-800/40">
                    <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
                      {quizScore} / {SPATIAL_QUIZ_QUESTIONS.length * 10}
                    </div>
                    <div className="text-xs text-teal-700 dark:text-teal-300 font-semibold mt-1">
                      {quizScore >= 80 ? '🌟 Bậc Thầy Không Gian & Ngữ Pháp HSK!' : '💪 Rất tốt! Hãy ôn lại các đại kỵ nhé!'}
                    </div>
                  </div>

                  <button
                    onClick={handleResetQuiz}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Luyện tập lại từ đầu
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
