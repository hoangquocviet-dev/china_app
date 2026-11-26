import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Volume2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Flame,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  PenTool,
  CheckCircle2,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  REDUPLICATION_LIST,
  REDUPLICATION_QUIZ_LIST,
  REDUPLICATION_CATEGORIES,
  REDUPLICATION_GOLDEN_RULES,
  ReduplicationItem,
} from '../../data/reduplicationData';
import { audioService } from '../../utils/audio';

interface ReduplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
}

export const ReduplicationModal: React.FC<ReduplicationModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'patterns' | 'quiz'>('rules');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('rd-1');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Filtered patterns
  const filteredPatterns = useMemo(() => {
    return REDUPLICATION_LIST.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchCat;

      const matchSearch =
        p.pattern.toLowerCase().includes(term) ||
        p.categoryName.toLowerCase().includes(term) ||
        p.formula.toLowerCase().includes(term) ||
        p.meaningEffect.toLowerCase().includes(term) ||
        p.coreWords.some((w) => w.toLowerCase().includes(term));

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

    const currentQ = REDUPLICATION_QUIZ_LIST[quizIndex];
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
    if (quizIndex + 1 < REDUPLICATION_QUIZ_LIST.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsQuizChecked(false);
    setQuizScore(0);
    setQuizStreak(0);
    setShowQuizResult(false);
  };

  const getRankBadge = (score: number) => {
    if (score >= 90) return { title: 'Bậc Thầy Trùng Điệp HSK 👑', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
    if (score >= 70) return { title: 'Cao Thủ Từ Láy 🌟', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' };
    if (score >= 50) return { title: 'Học Giả Tiến Bộ 📘', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    return { title: 'Tập Sự Trùng Điệp 🌱', color: 'text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800' };
  };

  const currentQuiz = REDUPLICATION_QUIZ_LIST[quizIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                    Trùng Điệp Từ & Từ Láy HSK
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium">重叠词宝典</span>
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 line-clamp-1">
                  Bí quyết nói tiếng Trung tự nhiên như người bản xứ & 4 đại kỵ bẫy đề thi
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'rules'
                  ? 'bg-white text-emerald-700 shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>4 Đại Kỵ & Bẫy Điểm 10</span>
            </button>

            <button
              onClick={() => setActiveTab('patterns')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'patterns'
                  ? 'bg-white text-emerald-700 shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kho Trùng Điệp ({REDUPLICATION_LIST.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-white text-emerald-700 shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Đố Vui Thử Thách ⚡</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: 4 GOLDEN RULES & PITFALLS */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-900/50">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                      Tại sao Trùng Điệp Từ (重叠词) là đỉnh cao của sự tự nhiên?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Người bản xứ rất ít khi dùng động từ đơn điệu trong giao tiếp nhẹ nhàng. Họ nói "我看看" thay vì "我看", nói "去散散步" thay vì "去散步". Nhưng trùng điệp trong tiếng Trung có những <strong>quy tắc thép và cấm kỵ bất di bất dịch</strong> mà đề thi HSK rất thích cài bẫy!
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Golden Rules Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  4 Quy Tắc Thép & Cấm Kỵ Cần Thuộc Lòng
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REDUPLICATION_GOLDEN_RULES.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">
                          {rule.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {rule.rule}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-center space-x-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span><strong>Sai:</strong> {rule.wrong}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span><strong>Đúng:</strong> {rule.right}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                          💡 {rule.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Jump CTA */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Sẵn sàng xem chi tiết từng công thức?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Khám phá toàn bộ 6 nhóm trùng điệp kèm phát âm mẫu và câu ví dụ.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('patterns')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <span>Xem Chi Tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PATTERNS HUB */}
          {activeTab === 'patterns' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo cấu trúc (AA, ABAB, AAB, AABB), từ mẫu (散步, 干净)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {REDUPLICATION_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patterns List */}
              <div className="space-y-3">
                {filteredPatterns.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                    Không tìm thấy cấu trúc trùng điệp nào phù hợp với "{searchTerm}".
                  </div>
                ) : (
                  filteredPatterns.map((item: ReduplicationItem) => {
                    const isExpanded = expandedId === item.id;
                    const sampleChar = item.coreWords[0]?.[0] || '看';

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border transition-all ${
                          isExpanded
                            ? 'bg-white dark:bg-slate-800/90 border-emerald-300 dark:border-emerald-700/60 shadow-md ring-1 ring-emerald-500/10'
                            : 'bg-white/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Header Row */}
                        <div
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-base shrink-0">
                              {sampleChar}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                                  {item.pattern}
                                </h3>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-medium">
                                  {item.categoryName}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Công thức: <strong className="text-slate-700 dark:text-slate-300">{item.formula}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {onSelectCharacter && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectCharacter(sampleChar);
                                  onClose();
                                }}
                                className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                title="Tập viết chữ này trong HanziWriter"
                              >
                                <PenTool className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="px-4 pb-5 sm:px-5 space-y-4 border-t border-slate-100 dark:border-slate-700/60 pt-4 animate-fade-in text-xs sm:text-sm">
                            {/* Meaning & Effect */}
                            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                                Tác dụng ngữ nghĩa:
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {item.meaningEffect}
                              </p>
                            </div>

                            {/* Core Vocabulary Grid */}
                            <div className="space-y-2">
                              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Các từ vựng mẫu tiêu biểu:
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.coreWords.map((cw, cwIdx) => {
                                  const hanziPart = cw.split('(')[0]?.trim() || '';
                                  return (
                                    <div
                                      key={cwIdx}
                                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                                    >
                                      <span className="font-medium text-slate-800 dark:text-slate-200">
                                        {cw}
                                      </span>
                                      <button
                                        onClick={(e) => handleSpeak(e, hanziPart)}
                                        className="p-1 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                                        title="Nghe phát âm"
                                      >
                                        <Volume2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Golden Note */}
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start space-x-2 text-xs text-amber-800 dark:text-amber-200">
                              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <strong>Lưu ý vàng:</strong> {item.goldenNote}
                              </div>
                            </div>

                            {/* Common Mistake Alert (if any) */}
                            {item.commonMistake && (
                              <div className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1.5 text-xs">
                                <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 font-bold">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span>Cảnh báo lỗi sai phổ biến:</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                                  <span className="text-rose-600 dark:text-rose-400 line-through">
                                    ✗ {item.commonMistake.wrong}
                                  </span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    ✓ {item.commonMistake.right}
                                  </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                                  {item.commonMistake.explanation}
                                </p>
                              </div>
                            )}

                            {/* Example Sentences */}
                            <div className="space-y-2">
                              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Câu giao tiếp mẫu:
                              </h4>
                              <div className="space-y-2">
                                {item.examples.map((ex, exIdx) => (
                                  <div
                                    key={exIdx}
                                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between"
                                  >
                                    <div className="space-y-1">
                                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                        {ex.chinese}
                                      </p>
                                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                                        {ex.pinyin}
                                      </p>
                                      <p className="text-xs text-slate-600 dark:text-slate-300">
                                        {ex.meaning}
                                      </p>
                                    </div>
                                    <button
                                      onClick={(e) => handleSpeak(e, ex.chinese)}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800 shrink-0 ml-2"
                                      title="Nghe phát âm cả câu"
                                    >
                                      <Volume2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: QUIZ MODE */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {!showQuizResult ? (
                <div className="space-y-5">
                  {/* Top Quiz Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        Câu {quizIndex + 1}/{REDUPLICATION_QUIZ_LIST.length}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {currentQuiz.ruleTested}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {quizStreak > 1 && (
                        <div className="flex items-center space-x-1 text-xs font-bold text-amber-500 animate-pulse">
                          <Flame className="w-4 h-4 fill-amber-500" />
                          <span>{quizStreak} Streak!</span>
                        </div>
                      )}
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Điểm: {quizScore}
                      </div>
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-700 space-y-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {currentQuiz.question}
                    </span>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                        {currentQuiz.sentence}
                      </p>
                      <button
                        onClick={(e) => handleSpeak(e, currentQuiz.sentence.replace(/___/g, ''))}
                        className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 shadow-sm shrink-0 ml-2"
                        title="Nghe câu"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                      {currentQuiz.pinyin}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Dịch: "{currentQuiz.meaning}"
                    </p>
                  </div>

                  {/* 4 Multiple Choice Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuiz.options.map((opt, oIdx) => {
                      let btnStyle =
                        'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-400';

                      if (isQuizChecked) {
                        if (oIdx === currentQuiz.correctIndex) {
                          btnStyle =
                            'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 font-bold';
                        } else if (oIdx === selectedOption) {
                          btnStyle =
                            'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                        } else {
                          btnStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-400';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isQuizChecked}
                          onClick={() => handleSelectQuizOption(oIdx)}
                          className={`p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between shadow-sm active:scale-[0.98] ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isQuizChecked && oIdx === currentQuiz.correctIndex && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                          {isQuizChecked && oIdx === selectedOption && oIdx !== currentQuiz.correctIndex && (
                            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {isQuizChecked && (
                    <div className="space-y-4 animate-fade-in">
                      <div
                        className={`p-4 rounded-xl border text-xs sm:text-sm ${
                          selectedOption === currentQuiz.correctIndex
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {selectedOption === currentQuiz.correctIndex ? '🎉 Chính xác!' : '💡 Giải thích chi tiết:'}
                        </p>
                        <p className="leading-relaxed">{currentQuiz.explanation}</p>
                      </div>

                      <button
                        onClick={handleNextQuiz}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
                      >
                        <span>{quizIndex + 1 < REDUPLICATION_QUIZ_LIST.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Scorecard Result View */
                <div className="text-center py-6 sm:py-8 space-y-6 max-w-md mx-auto animate-fade-in">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="w-10 h-10 animate-bounce" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                      Hoàn Thành Thử Thách!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Bạn đã hoàn thành 10 câu trắc nghiệm bẫy trùng điệp từ HSK 1 - 3
                    </p>
                  </div>

                  {/* Score Pill */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {quizScore} <span className="text-sm font-normal text-slate-400">/ 100 điểm</span>
                    </div>

                    {/* Rank Badge */}
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                        getRankBadge(quizScore).color
                      }`}
                    >
                      {getRankBadge(quizScore).title}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={handleRestartQuiz}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Luyện tập lại</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('patterns')}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm active:scale-95 transition-all"
                    >
                      Xem kho từ láy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
