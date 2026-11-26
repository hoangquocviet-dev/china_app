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
} from 'lucide-react';
import {
  PARTICLES_LIST,
  PARTICLES_QUIZ_LIST,
  THREE_DE_SUMMARY,
} from '../../data/particlesData';
import { audioService } from '../../utils/audio';

interface ParticlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
}

export const ParticlesModal: React.FC<ParticlesModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'three_de' | 'all_particles' | 'quiz'>('three_de');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('pt-de-1');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Filtered particles
  const filteredParticles = useMemo(() => {
    return PARTICLES_LIST.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchCat;

      const matchSearch =
        p.hanzi.includes(term) ||
        p.pinyin.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        p.nickname.toLowerCase().includes(term) ||
        p.usageRule.toLowerCase().includes(term) ||
        p.formula.toLowerCase().includes(term);

      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  const threeDeList = useMemo(() => {
    return PARTICLES_LIST.filter((p) => p.category === 'structural');
  }, []);

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakChinese(text);
  };

  const handleSelectQuizOption = (idx: number) => {
    if (isQuizChecked) return;
    setSelectedOption(idx);
    setIsQuizChecked(true);

    const currentQ = PARTICLES_QUIZ_LIST[quizIndex];
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
    if (quizIndex + 1 < PARTICLES_QUIZ_LIST.length) {
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

  const currentQuizItem = PARTICLES_QUIZ_LIST[quizIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-6 animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[92vh] max-h-[850px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
        data-testid="particles-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm shadow-inner">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  Trợ Từ & Bí Kíp 3 Chữ "ĐÍCH"
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                  的 · 得 · 地
                </span>
              </div>
              <p className="text-xs text-purple-100 mt-0.5">
                Khẩu quyết phân biệt 的 - 得 - 地, trợ từ động thái 了-着-过 & trợ từ ngữ khí 吧-呢-吗
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            data-testid="close-particles-modal-btn"
            className="p-2 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shrink-0">
          <button
            onClick={() => setActiveTab('three_de')}
            data-testid="particles-tab-three-de"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'three_de'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span>🎯 Bí Kíp 3 Chữ "Đích" (的 · 得 · 地)</span>
          </button>

          <button
            onClick={() => setActiveTab('all_particles')}
            data-testid="particles-tab-all"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'all_particles'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kho Trợ Từ ({filteredParticles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            data-testid="particles-tab-quiz"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Đố Vui Điền Trợ Từ ⚡</span>
            {quizScore > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold">
                {quizScore}đ
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Bí Kíp 3 Chữ Đích (的 - 得 - 地) */}
        {activeTab === 'three_de' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Master Summary Card */}
            <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-indigo-500/10 border border-violet-500/20 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-bold text-sm">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>{THREE_DE_SUMMARY.title}</span>
              </div>

              {/* Golden Poem */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {THREE_DE_SUMMARY.goldenPoem.map((line, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 flex items-center justify-center shrink-0 font-bold">
                      {idx + 1}
                    </span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>

              {/* Master Sentence Showcase */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-900/50 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                    ⭐ Câu Kinh Điển Kết Hợp Cả 3 Chữ "ĐÍCH":
                  </span>
                  <button
                    onClick={(e) => handleSpeak(e, THREE_DE_SUMMARY.masterSentence.chinese)}
                    className="p-1 rounded-lg text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                  他
                  <span className="text-emerald-600 dark:text-emerald-400 underline decoration-2">
                    高兴地
                  </span>
                  对我说，
                  <span className="text-sky-600 dark:text-sky-400 underline decoration-2">
                    我的
                  </span>
                  汉语
                  <span className="text-amber-600 dark:text-amber-400 underline decoration-2">
                    考得
                  </span>
                  很好！
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                  "{THREE_DE_SUMMARY.masterSentence.meaning}"
                </div>
              </div>
            </div>

            {/* 3 DE Detail Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {threeDeList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Character & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 font-black text-3xl flex items-center justify-center shadow-inner">
                          {item.hanzi}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.pinyin}
                          </div>
                          <div className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold">
                            {item.nickname}
                          </div>
                        </div>
                      </div>

                      {onSelectCharacter && (
                        <button
                          onClick={() => {
                            onSelectCharacter(item.hanzi);
                            onClose();
                          }}
                          title="Tập viết chữ này trong HanziWriter"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-slate-600 dark:text-slate-300 hover:text-violet-600 transition-colors"
                        >
                          <PenTool className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Formula */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                      📐 {item.formula}
                    </div>

                    {/* Rule */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.usageRule}
                    </p>

                    {/* Mnemonic */}
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs border border-amber-200 dark:border-amber-900/50">
                      💡 <span className="font-bold">Mẹo:</span> {item.memoryMnemonic}
                    </div>

                    {/* Examples */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Ví dụ mẫu:
                      </div>
                      {item.examples.slice(0, 2).map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-xs space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-100">
                              {ex.chinese}
                            </span>
                            <button
                              onClick={(e) => handleSpeak(e, ex.chinese)}
                              className="text-slate-400 hover:text-violet-600"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-500 italic">"{ex.meaning}"</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common mistake */}
                  {item.commonMistake && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs space-y-1">
                      <div className="text-rose-500 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Tránh bẫy nhầm lẫn:</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="line-through text-rose-400">{item.commonMistake.wrong}</span>{' '}
                        ➔ <span className="text-emerald-500 font-bold">{item.commonMistake.right}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Kho Trợ Từ Toàn Diện */}
        {activeTab === 'all_particles' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Category Filter */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm trợ từ (hanzi, pinyin, tên gọi, công thức, quy tắc)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'structural', label: 'Trợ từ kết cấu (的·得·地)' },
                  { id: 'aspect', label: 'Trợ từ động thái (了·着·过)' },
                  { id: 'modal', label: 'Trợ từ ngữ khí (吧·呢·吗)' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200 ring-1 ring-violet-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredParticles.map((item) => {
                const isExpanded = expandedId === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 font-black text-2xl flex items-center justify-center shadow-inner">
                          {item.hanzi}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-slate-900 dark:text-white">
                              {item.name}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {item.categoryName}
                            </span>
                          </div>
                          <div className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                            {item.pinyin} · {item.nickname}
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
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-violet-100 text-slate-600 dark:text-slate-300 hover:text-violet-600 transition-colors"
                          >
                            <PenTool className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100 transition-colors"
                        >
                          {isExpanded ? 'Thu gọn' : 'Chi tiết'}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                      📐 Công thức: {item.formula}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in text-xs">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {item.usageRule}
                        </p>

                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/50">
                          💡 <span className="font-bold">Mẹo nhớ nhanh:</span> {item.memoryMnemonic}
                        </div>

                        <div className="space-y-2 pt-1">
                          <div className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                            Câu ví dụ minh họa:
                          </div>
                          {item.examples.map((ex, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/60 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">
                                  {ex.chinese}
                                </span>
                                <button
                                  onClick={(e) => handleSpeak(e, ex.chinese)}
                                  className="text-slate-400 hover:text-violet-600"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                                {ex.pinyin}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 italic">
                                "{ex.meaning}"
                              </div>
                            </div>
                          ))}
                        </div>

                        {item.commonMistake && (
                          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1">
                            <div className="text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Lỗi sai thường gặp:</span>
                            </div>
                            <div className="text-slate-700 dark:text-slate-300">
                              <span className="line-through text-rose-500">{item.commonMistake.wrong}</span>{' '}
                              ➔{' '}
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                {item.commonMistake.right}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {item.commonMistake.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Đố Vui Điền Trợ Từ */}
        {activeTab === 'quiz' && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
            {showQuizResult ? (
              <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 text-center shadow-2xl space-y-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-violet-100 dark:bg-violet-900/60 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Hoàn Thành Thử Thách Trợ Từ!
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Bạn đã nắm vững cách phân biệt 的-得-地 và các trợ từ tiếng Trung
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-around">
                  <div>
                    <div className="text-2xl font-black text-violet-600 dark:text-violet-400">
                      {quizScore}
                    </div>
                    <div className="text-xs text-slate-500">Tổng điểm</div>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <div className="text-2xl font-black text-amber-500">
                      {Math.round((quizScore / (PARTICLES_QUIZ_LIST.length * 10)) * 100)}%
                    </div>
                    <div className="text-xs text-slate-500">Độ chính xác</div>
                  </div>
                </div>

                <button
                  onClick={handleResetQuiz}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2"
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
                    Câu hỏi {quizIndex + 1} / {PARTICLES_QUIZ_LIST.length}
                  </span>

                  {quizStreak > 1 && (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{quizStreak} combo!</span>
                    </div>
                  )}
                </div>

                {/* Sentence Prompt */}
                <div className="p-5 rounded-2xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800/60 space-y-2 text-center">
                  <div className="text-2xl font-black text-slate-900 dark:text-white tracking-wide">
                    {currentQuizItem.sentence}
                  </div>
                  <div className="text-sm font-medium text-violet-600 dark:text-violet-400">
                    {currentQuizItem.pinyin}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                    "{currentQuizItem.meaning}"
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
                        'border-slate-200 dark:border-slate-700 hover:border-violet-500 hover:bg-violet-50/30 dark:hover:bg-violet-950/30 text-slate-800 dark:text-slate-100';
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
                        <span className="text-2xl font-black">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isQuizChecked && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 animate-fade-in">
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      💡 <span className="font-bold">Giải thích:</span> {currentQuizItem.explanation}
                    </div>

                    <button
                      onClick={handleNextQuiz}
                      className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>
                        {quizIndex + 1 < PARTICLES_QUIZ_LIST.length
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
