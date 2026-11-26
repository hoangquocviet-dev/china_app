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
  GitCompare,
} from 'lucide-react';
import {
  CONNECTORS_LIST,
  CONNECTOR_QUIZ_LIST,
  CONNECTOR_CATEGORIES,
  GOLDEN_COMPARISONS,
  ConnectorItem,
} from '../../data/connectorsData';
import { audioService } from '../../utils/audio';

interface ConnectorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
}

export const ConnectorsModal: React.FC<ConnectorsModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'all_connectors' | 'quiz'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('cn-1');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Filtered connectors
  const filteredConnectors = useMemo(() => {
    return CONNECTORS_LIST.filter((c) => {
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchCat;

      const matchSearch =
        c.pair.includes(term) ||
        c.pinyin.toLowerCase().includes(term) ||
        c.vietnamese.toLowerCase().includes(term) ||
        c.formula.toLowerCase().includes(term) ||
        c.usageRule.toLowerCase().includes(term) ||
        c.goldenTip.toLowerCase().includes(term);

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

    const currentQ = CONNECTOR_QUIZ_LIST[quizIndex];
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
    if (quizIndex + 1 < CONNECTOR_QUIZ_LIST.length) {
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
    if (score >= 90) return { title: 'Bậc Thầy Nối Câu HSK 👑', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
    if (score >= 70) return { title: 'Cao Thủ Liên Từ 🌟', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' };
    if (score >= 50) return { title: 'Học Giả Tiến Bộ 📘', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    return { title: 'Tập Sự Nối Câu 🌱', color: 'text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800' };
  };

  const currentQuiz = CONNECTOR_QUIZ_LIST[quizIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl h-[94dvh] sm:max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <GitCompare className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                    Liên Từ & Cặp Từ Nối HSK
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium">常用关联词</span>
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-indigo-100 line-clamp-1">
                  Bí kíp ghép câu mượt mà, phân biệt bẫy logic ngữ pháp & phản xạ HSK 1 - 3
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
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-1.5 min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap touch-manipulation active:scale-95 ${
                activeTab === 'overview'
                  ? 'bg-white text-indigo-600 shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Bẫy & Mẹo Vàng</span>
            </button>

            <button
              onClick={() => setActiveTab('all_connectors')}
              className={`flex items-center space-x-1.5 min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap touch-manipulation active:scale-95 ${
                activeTab === 'all_connectors'
                  ? 'bg-white text-indigo-600 shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kho 18 Cặp Liên Từ ({CONNECTORS_LIST.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center space-x-1.5 min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap touch-manipulation active:scale-95 ${
                activeTab === 'quiz'
                  ? 'bg-white text-indigo-600 shadow-md scale-105'
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
          {/* TAB 1: OVERVIEW & GOLDEN COMPARISONS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500 text-white shrink-0 mt-0.5">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                      Tại sao Liên Từ (关联词) lại quyết định điểm số HSK?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Nếu từ vựng là từng viên gạch thì <strong>Liên từ nối câu</strong> chính là lớp xi măng kết dính. Người mới học thường chỉ nói các câu đơn ngắn rời rạc ("Tôi ăn cơm. Tôi đi học."). Nắm vững các cặp từ nối giúp câu văn trở nên trôi chảy, logic chặt chẽ và đạt điểm tối đa trong các bài tập ghép câu và đọc hiểu!
                    </p>
                  </div>
                </div>
              </div>

              {/* 2 Golden Comparisons */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  2 Bẫy Ngữ Pháp Kinh Điển Nhất Trong Đề Thi
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {GOLDEN_COMPARISONS.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
                    >
                      <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span>{comp.title}</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tip A */}
                        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">
                              {comp.tipA.pattern}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-medium">
                              {comp.tipA.nature}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {comp.tipA.desc}
                          </p>
                          <div className="pt-2 border-t border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{comp.tipA.example}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{comp.tipA.meaning}</p>
                            </div>
                            <button
                              onClick={(e) => handleSpeak(e, comp.tipA.example)}
                              className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                              title="Nghe phát âm"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Tip B */}
                        <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">
                              {comp.tipB.pattern}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 font-medium">
                              {comp.tipB.nature}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {comp.tipB.desc}
                          </p>
                          <div className="pt-2 border-t border-purple-100 dark:border-purple-900/30 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{comp.tipB.example}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{comp.tipB.meaning}</p>
                            </div>
                            <button
                              onClick={(e) => handleSpeak(e, comp.tipB.example)}
                              className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                              title="Nghe phát âm"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Memory key */}
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs font-semibold text-amber-800 dark:text-amber-200">
                        {comp.memoryKey}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Jump CTA */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Sẵn sàng tra cứu chi tiết hoặc làm bài tập?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Khám phá toàn bộ 18 cặp liên từ phân loại theo 6 quan hệ ngữ nghĩa.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('all_connectors')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <span>Xem Tất Cả</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL CONNECTORS HUB */}
          {activeTab === 'all_connectors' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo Hán tự (因为, 虽然), Pinyin (suǒyǐ), tiếng Việt (mặc dù, chỉ cần)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
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
                  {CONNECTOR_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Connectors List */}
              <div className="space-y-3">
                {filteredConnectors.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                    Không tìm thấy cặp liên từ nào phù hợp với "{searchTerm}".
                  </div>
                ) : (
                  filteredConnectors.map((item: ConnectorItem) => {
                    const isExpanded = expandedId === item.id;
                    const firstChar = item.pair.replace(/[…\s]/g, '')[0] || '因';

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border transition-all ${
                          isExpanded
                            ? 'bg-white dark:bg-slate-800/90 border-indigo-300 dark:border-indigo-700/60 shadow-md ring-1 ring-indigo-500/10'
                            : 'bg-white/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Header Row */}
                        <div
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shrink-0">
                              {firstChar}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                                  {item.pair}
                                </h3>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                                  {item.hskLevel}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium">
                                  {item.categoryName}
                                </span>
                              </div>
                              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                                {item.pinyin}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Nghĩa: <strong className="text-slate-700 dark:text-slate-300">{item.vietnamese}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              onClick={(e) => handleSpeak(e, item.pair.replace(/[…\s]/g, ''))}
                              className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 active:scale-95 transition-all"
                              title="Nghe phát âm"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                            {onSelectCharacter && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectCharacter(firstChar);
                                  onClose();
                                }}
                                className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
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
                            {/* Formula Box */}
                            <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center space-x-3">
                              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide shrink-0">
                                Cấu trúc:
                              </span>
                              <code className="text-xs sm:text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                                {item.formula}
                              </code>
                            </div>

                            {/* Usage Rules & Golden Tip */}
                            <div className="space-y-2">
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                <strong>Cách dùng:</strong> {item.usageRule}
                              </p>
                              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start space-x-2 text-xs text-amber-800 dark:text-amber-200">
                                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                  <strong>Mẹo vàng ghi nhớ:</strong> {item.goldenTip}
                                </div>
                              </div>
                            </div>

                            {/* Example Sentences */}
                            <div className="space-y-2">
                              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Câu ví dụ song ngữ:
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
                                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                                        {ex.pinyin}
                                      </p>
                                      <p className="text-xs text-slate-600 dark:text-slate-300">
                                        {ex.meaning}
                                      </p>
                                    </div>
                                    <button
                                      onClick={(e) => handleSpeak(e, ex.chinese)}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-800 shrink-0 ml-2"
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
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                        Câu {quizIndex + 1}/{CONNECTOR_QUIZ_LIST.length}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {currentQuiz.relationship}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {quizStreak > 1 && (
                        <div className="flex items-center space-x-1 text-xs font-bold text-amber-500 animate-pulse">
                          <Flame className="w-4 h-4 fill-amber-500" />
                          <span>{quizStreak} Streak!</span>
                        </div>
                      )}
                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Điểm: {quizScore}
                      </div>
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Điền cặp liên từ thích hợp vào chỗ trống:
                      </span>
                      <button
                        onClick={(e) => handleSpeak(e, currentQuiz.sentence.replace(/___/g, ''))}
                        className="w-11 h-11 flex items-center justify-center rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-slate-600 active:scale-90 transition-all touch-manipulation shadow-xs shrink-0 ml-2"
                        title="Nghe câu"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                      {currentQuiz.sentence}
                    </p>
                    <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                      {currentQuiz.pinyin}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium pt-1">
                      Dịch: "{currentQuiz.meaning}"
                    </p>
                  </div>

                  {/* 4 Multiple Choice Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuiz.options.map((opt, oIdx) => {
                      let btnStyle =
                        'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';

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
                        className="w-full min-h-[50px] py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all flex items-center justify-center space-x-2 touch-manipulation"
                      >
                        <span>{quizIndex + 1 < CONNECTOR_QUIZ_LIST.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Scorecard Result View */
                <div className="text-center py-6 sm:py-8 space-y-6 max-w-md mx-auto animate-fade-in">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-lg border border-indigo-200 dark:border-indigo-800">
                    <Sparkles className="w-10 h-10 animate-bounce" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                      Hoàn Thành Thử Thách!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Bạn đã hoàn thành 10 câu trắc nghiệm phản xạ liên từ HSK 1 - 3
                    </p>
                  </div>

                  {/* Score Pill */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
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
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Luyện tập lại</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('all_connectors')}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm active:scale-95 transition-all"
                    >
                      Xem kho liên từ
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
