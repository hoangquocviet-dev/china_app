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
  Repeat,
  ShieldAlert,
} from 'lucide-react';
import {
  BABEI_LIST,
  BABEI_QUIZ_LIST,
  BABEI_GOLDEN_RULES,
  TWO_WAY_TRANSFORM_LIST,
  BaBeiItem,
} from '../../data/baBeiData';
import { audioService } from '../../utils/audio';

interface BaBeiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
}

export const BaBeiModal: React.FC<BaBeiModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'catalog' | 'transform' | 'quiz'>('rules');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('bb-1');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Filtered items
  const filteredItems = useMemo(() => {
    return BABEI_LIST.filter((item) => {
      const matchType = selectedType === 'all' || item.type === selectedType;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchType;

      const matchSearch =
        item.pattern.toLowerCase().includes(term) ||
        item.typeName.toLowerCase().includes(term) ||
        item.formula.toLowerCase().includes(term) ||
        item.meaningEffect.toLowerCase().includes(term);

      return matchType && matchSearch;
    });
  }, [searchTerm, selectedType]);

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakChinese(text);
  };

  const handleSelectQuizOption = (idx: number) => {
    if (isQuizChecked) return;
    setSelectedOption(idx);
    setIsQuizChecked(true);

    const currentQ = BABEI_QUIZ_LIST[quizIndex];
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
    if (quizIndex + 1 < BABEI_QUIZ_LIST.length) {
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
    if (score >= 90) return { title: 'Bậc Thầy Câu Chữ 把 & 被 👑', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
    if (score >= 70) return { title: 'Cao Thủ Ngữ Pháp HSK 🌟', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' };
    if (score >= 50) return { title: 'Học Giả Tiến Bộ 📘', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    return { title: 'Tập Sự Câu Xử Lý 🌱', color: 'text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800' };
  };

  const currentQuiz = BABEI_QUIZ_LIST[quizIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl h-[94dvh] sm:max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                    Câu Chữ "把" & Câu Chữ "被" HSK
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium">把字句与被字句</span>
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-rose-100 line-clamp-1">
                  Đỉnh cao ngữ pháp sắp xếp câu: Câu xử lý 把, Câu bị động 被 & Chuyển đổi 2 chiều
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all touch-manipulation shrink-0 ml-2"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 mt-4 overflow-x-auto touch-scroll-x pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-1.5 min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap touch-manipulation active:scale-95 ${
                activeTab === 'rules'
                  ? 'bg-white text-rose-700 shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>4 Đại Kỵ Bất Di Bất Dịch</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center space-x-1.5 min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap touch-manipulation active:scale-95 ${
                activeTab === 'catalog'
                  ? 'bg-white text-rose-700 shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kho Cấu Trúc ({BABEI_LIST.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('transform')}
              className={`flex items-center space-x-1.5 min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap touch-manipulation active:scale-95 ${
                activeTab === 'transform'
                  ? 'bg-white text-rose-700 shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Repeat className="w-4 h-4 text-amber-300" />
              <span>Chuyển Đổi 2 Chiều 把 $\leftrightarrow$ 被</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center space-x-1.5 min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap touch-manipulation active:scale-95 ${
                activeTab === 'quiz'
                  ? 'bg-white text-rose-700 shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Đố Vui Phản Xạ ⚡</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: 4 GOLDEN RULES & PITFALLS */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-100 dark:border-rose-900/50">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                      Tại sao Câu Chữ 把 và 被 là "vua của các đề thi HSK"?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Tiếng Việt thường chỉ nói "Tôi ăn táo rồi", "Tôi trả sách rồi". Nhưng trong tiếng Trung, khi muốn nhấn mạnh <strong>sự xử lý làm biến đổi trạng thái</strong> hoặc <strong>sự việc không may xảy đến (bị động)</strong>, người bản xứ dùng câu chữ <strong>把</strong> và <strong>被</strong>. Nắm vững 4 đại kỵ bất di bất dịch dưới đây sẽ giúp bạn không bao giờ bị trừ điểm ở phần sắp xếp câu!
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Golden Rules Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  4 Đại Kỵ Bất Di Bất Dịch Trong Đề Thi
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BABEI_GOLDEN_RULES.map((rule, idx) => (
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
                    Sẵn sàng xem bảng chuyển đổi 2 chiều 把 $\leftrightarrow$ 被?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bí quyết biến đổi qua lại thần thánh giữa câu chủ động xử lý và bị động.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('transform')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <span>Xem Chuyển Đổi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo cấu trúc (把, 被, 了, 完, 在, 给)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
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

                {/* Type Filter */}
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                      selectedType === 'all'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Tất cả cấu trúc
                  </button>
                  <button
                    onClick={() => setSelectedType('ba')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                      selectedType === 'ba'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Câu chữ 把 (Xử lý)
                  </button>
                  <button
                    onClick={() => setSelectedType('bei')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                      selectedType === 'bei'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Câu chữ 被 (Bị động)
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                    Không tìm thấy cấu trúc nào phù hợp với "{searchTerm}".
                  </div>
                ) : (
                  filteredItems.map((item: BaBeiItem) => {
                    const isExpanded = expandedId === item.id;
                    const primaryChar = item.type === 'ba' ? '把' : '被';

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border transition-all ${
                          isExpanded
                            ? 'bg-white dark:bg-slate-800/90 border-rose-300 dark:border-rose-700/60 shadow-md ring-1 ring-rose-500/10'
                            : 'bg-white/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Header Row */}
                        <div
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-lg shrink-0">
                              {primaryChar}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                                  {item.pattern}
                                </h3>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-medium">
                                  {item.typeName}
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
                                  onSelectCharacter(primaryChar);
                                  onClose();
                                }}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
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
                            <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 space-y-1">
                              <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wide">
                                Tác dụng ngữ nghĩa:
                              </span>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {item.meaningEffect}
                              </p>
                            </div>

                            {/* Golden Rule */}
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start space-x-2 text-xs text-amber-800 dark:text-amber-200">
                              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <strong>Lưu ý vàng:</strong> {item.goldenRule}
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
                                      <p className="text-xs text-rose-600 dark:text-rose-400 font-mono">
                                        {ex.pinyin}
                                      </p>
                                      <p className="text-xs text-slate-600 dark:text-slate-300">
                                        {ex.meaning}
                                      </p>
                                    </div>
                                    <button
                                      onClick={(e) => handleSpeak(e, ex.chinese)}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 shrink-0 ml-2"
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

          {/* TAB 3: TWO-WAY TRANSFORM */}
          {activeTab === 'transform' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1 text-xs sm:text-sm">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Repeat className="w-4 h-4 text-amber-600" />
                  Quy Tắc Vàng Hoán Đổi Hai Chiều: 把 $\leftrightarrow$ 被
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  Chủ ngữ của câu chữ 把 chính là <strong>Tác nhân</strong> (đứng sau 被). Tân ngữ sau 把 chính là <strong>Đối tượng chịu tác động</strong> (đứng đầu câu 被)!
                </p>
              </div>

              <div className="space-y-4">
                {TWO_WAY_TRANSFORM_LIST.map((pair, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* BA Box */}
                      <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                            Câu chữ 把 (Chủ động xử lý)
                          </span>
                          <button
                            onClick={(e) => handleSpeak(e, pair.baSentence.chinese)}
                            className="p-1 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100 pt-1">
                          {pair.baSentence.chinese}
                        </p>
                        <p className="text-xs text-rose-600 dark:text-rose-400 font-mono">
                          {pair.baSentence.pinyin}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {pair.baSentence.meaning}
                        </p>
                      </div>

                      {/* BEI Box */}
                      <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            Câu chữ 被 (Bị động)
                          </span>
                          <button
                            onClick={(e) => handleSpeak(e, pair.beiSentence.chinese)}
                            className="p-1 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100 pt-1">
                          {pair.beiSentence.chinese}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                          {pair.beiSentence.pinyin}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {pair.beiSentence.meaning}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-amber-800 dark:text-amber-300 italic pt-1">
                      💡 {pair.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUIZ MODE */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {!showQuizResult ? (
                <div className="space-y-5">
                  {/* Top Quiz Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                        Câu {quizIndex + 1}/{BABEI_QUIZ_LIST.length}
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
                      <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        Điểm: {quizScore}
                      </div>
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/30 dark:from-slate-800 dark:to-rose-950/20 border border-slate-200 dark:border-slate-700 space-y-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {currentQuiz.question}
                    </span>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                        {currentQuiz.sentence}
                      </p>
                      <button
                        onClick={(e) => handleSpeak(e, currentQuiz.sentence.replace(/___/g, ''))}
                        className="w-11 h-11 flex items-center justify-center rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-slate-600 active:scale-90 transition-all touch-manipulation shadow-xs shrink-0 ml-2"
                        title="Nghe câu"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-mono">
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
                        'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-rose-400';

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
                          className={`min-h-[52px] p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between shadow-sm active:scale-[0.98] touch-manipulation ${btnStyle}`}
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
                        className="w-full min-h-[50px] py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-md hover:from-rose-700 hover:to-pink-700 active:scale-95 transition-all flex items-center justify-center space-x-2 touch-manipulation"
                      >
                        <span>{quizIndex + 1 < BABEI_QUIZ_LIST.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Scorecard Result View */
                <div className="text-center py-6 sm:py-8 space-y-6 max-w-md mx-auto animate-fade-in">
                  <div className="w-20 h-20 rounded-3xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-lg border border-rose-200 dark:border-rose-800">
                    <Sparkles className="w-10 h-10 animate-bounce" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                      Hoàn Thành Thử Thách!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Bạn đã hoàn thành 10 câu trắc nghiệm bẫy câu chữ 把 & 被 HSK
                    </p>
                  </div>

                  {/* Score Pill */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
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
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Luyện tập lại</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm active:scale-95 transition-all"
                    >
                      Xem kho cấu trúc
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
