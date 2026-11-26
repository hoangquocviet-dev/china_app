import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Volume2,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  ArrowRight,
  Flame,
  MessageSquare,
  Lightbulb,
  Radio,
} from 'lucide-react';
import {
  SPOKEN_CATEGORIES,
  SPOKEN_QA_PAIRS,
  SPOKEN_QUIZ_LIST,
  SpokenQAPair,
} from '../../data/spokenResponsesData';
import { audioService } from '../../utils/audio';

interface SpokenResponsesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPracticeSentence?: (text: string, pinyin?: string, meaning?: string) => void;
  onSelectCharacter?: (char: string) => void;
}

export const SpokenResponsesModal: React.FC<SpokenResponsesModalProps> = ({
  isOpen,
  onClose,
  onPracticeSentence,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'qa' | 'auto_player' | 'quiz'>('qa');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [playingPairId, setPlayingPairId] = useState<string | null>(null);

  // Auto Player state
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayerIndex, setAutoPlayerIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 1.0>(1.0);
  const autoPlayTimeoutRef = useRef<any>(null);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Filtered pairs
  const filteredPairs = useMemo(() => {
    return SPOKEN_QA_PAIRS.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchCat;

      const matchSearch =
        item.question.chinese.includes(term) ||
        item.question.pinyin.toLowerCase().includes(term) ||
        item.question.meaning.toLowerCase().includes(term) ||
        item.response.chinese.includes(term) ||
        item.response.pinyin.toLowerCase().includes(term) ||
        item.response.meaning.toLowerCase().includes(term) ||
        (item.alternativeResponse &&
          (item.alternativeResponse.chinese.includes(term) ||
            item.alternativeResponse.meaning.toLowerCase().includes(term))) ||
        (item.culturalTip && item.culturalTip.toLowerCase().includes(term));

      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  // Clean up auto player on unmount or tab switch
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  // Handle auto-player loop
  useEffect(() => {
    if (!isAutoPlaying || activeTab !== 'auto_player' || !isOpen) {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      return;
    }

    const currentPair = SPOKEN_QA_PAIRS[autoPlayerIndex % SPOKEN_QA_PAIRS.length];
    audioService.speakChinese(currentPair.question.chinese, playbackSpeed);

    // After question finishes, play response, then next pair
    autoPlayTimeoutRef.current = setTimeout(() => {
      audioService.speakChinese(currentPair.response.chinese, playbackSpeed);

      autoPlayTimeoutRef.current = setTimeout(() => {
        setAutoPlayerIndex((prev) => (prev + 1) % SPOKEN_QA_PAIRS.length);
      }, 3500);
    }, 2800);

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [isAutoPlaying, autoPlayerIndex, activeTab, isOpen, playbackSpeed]);

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakChinese(text, playbackSpeed);
  };

  const handlePlayPair = (e: React.MouseEvent, pair: SpokenQAPair) => {
    e.stopPropagation();
    if (playingPairId === pair.id) {
      setPlayingPairId(null);
      return;
    }

    setPlayingPairId(pair.id);
    audioService.speakChinese(pair.question.chinese, playbackSpeed);

    setTimeout(() => {
      audioService.speakChinese(pair.response.chinese, playbackSpeed);
      setTimeout(() => {
        setPlayingPairId(null);
      }, 2000);
    }, 2200);
  };

  const handleSelectQuizOption = (idx: number) => {
    if (isQuizChecked) return;
    setSelectedOption(idx);
    setIsQuizChecked(true);

    const currentQ = SPOKEN_QUIZ_LIST[quizIndex];
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
    if (quizIndex + 1 < SPOKEN_QUIZ_LIST.length) {
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

  const activeAutoPair = SPOKEN_QA_PAIRS[autoPlayerIndex % SPOKEN_QA_PAIRS.length];
  const currentQuizItem = SPOKEN_QUIZ_LIST[quizIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-6 animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[92vh] max-h-[850px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
        data-testid="spoken-responses-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm shadow-inner">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  Khẩu Ngữ & Phản Xạ Ứng Đáp
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                  实用口语
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Cặp câu giao tiếp thực tế, phản xạ hỏi - đáp tức thì & thanh toán di động
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            data-testid="close-spoken-modal-btn"
            className="p-2 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shrink-0">
          <button
            onClick={() => {
              setActiveTab('qa');
              setIsAutoPlaying(false);
            }}
            data-testid="spoken-tab-qa"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'qa'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Cặp Câu Hỏi - Đáp ({filteredPairs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('auto_player')}
            data-testid="spoken-tab-player"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'auto_player'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Tự Động Phát Tuần Hoàn 🎧</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('quiz');
              setIsAutoPlaying(false);
            }}
            data-testid="spoken-tab-quiz"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Đố Vui Phản Xạ ⚡</span>
            {quizScore > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold">
                {quizScore}đ
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Cặp câu Hỏi - Đáp */}
        {activeTab === 'qa' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Categories */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm chữ Hán, Pinyin, nghĩa tiếng Việt, mẹo văn hóa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {SPOKEN_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pairs List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredPairs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <p className="text-sm">Không tìm thấy mẫu câu phù hợp</p>
                </div>
              ) : (
                filteredPairs.map((pair) => {
                  const isExpanded = expandedCardId === pair.id;
                  const isPlaying = playingPairId === pair.id;

                  return (
                    <div
                      key={pair.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all"
                    >
                      {/* Category & Action buttons */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <span>{pair.categoryIcon}</span>
                          <span>{pair.categoryName}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handlePlayPair(e, pair)}
                            title="Phát trọn vẹn cả Hỏi & Đáp"
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                              isPlaying
                                ? 'bg-amber-500 text-white animate-pulse'
                                : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isPlaying ? 'Đang phát...' : 'Phát Hỏi & Đáp'}</span>
                          </button>

                          {onPracticeSentence && (
                            <button
                              onClick={() => {
                                onPracticeSentence(
                                  pair.response.chinese,
                                  pair.response.pinyin,
                                  pair.response.meaning
                                );
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors"
                            >
                              Luyện nói
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Question Box */}
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/80 mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            ❓ {pair.question.speaker}
                          </span>
                          <button
                            onClick={(e) => handleSpeak(e, pair.question.chinese)}
                            className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                            title="Phát âm câu hỏi"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-base font-bold text-slate-900 dark:text-white">
                          {pair.question.chinese}
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                          {pair.question.pinyin}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                          "{pair.question.meaning}"
                        </div>
                      </div>

                      {/* Response Box */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            💬 {pair.response.speaker}
                          </span>
                          <button
                            onClick={(e) => handleSpeak(e, pair.response.chinese)}
                            className="p-1 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                            title="Phát âm câu trả lời"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-base font-bold text-emerald-950 dark:text-emerald-100">
                          {pair.response.chinese}
                        </div>
                        <div className="text-xs text-teal-700 dark:text-teal-300 font-medium mt-0.5">
                          {pair.response.pinyin}
                        </div>
                        <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
                          👉 {pair.response.meaning}
                        </div>
                      </div>

                      {/* Expand / Collapse Details */}
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <button
                          onClick={() => setExpandedCardId(isExpanded ? null : pair.id)}
                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Thu gọn bí quyết' : 'Xem biến thể & mẹo văn hóa'}</span>
                        </button>

                        {pair.keywords && pair.keywords.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {pair.keywords.map((kw, i) => (
                              <span
                                key={i}
                                onClick={() => onSelectCharacter && onSelectCharacter(kw.word[0])}
                                className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                                title="Bấm để tập viết chữ này"
                              >
                                {kw.word} ({kw.pinyin})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-2.5 animate-fade-in text-xs">
                          {pair.alternativeResponse && (
                            <div className="p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200 border border-cyan-100 dark:border-cyan-900/40">
                              <span className="font-bold">Cách đáp khác: </span>
                              <span className="font-semibold">{pair.alternativeResponse.chinese}</span> (
                              <span className="text-cyan-600 dark:text-cyan-400">
                                {pair.alternativeResponse.pinyin}
                              </span>
                              ) - <span>{pair.alternativeResponse.meaning}</span>
                            </div>
                          )}

                          {pair.culturalTip && (
                            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-amber-900/40 flex items-start gap-2">
                              <span className="shrink-0 text-amber-500 font-bold">💡 Mẹo văn hóa:</span>
                              <span>{pair.culturalTip}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Tự Động Phát Tuần Hoàn (Auto Player) */}
        {activeTab === 'auto_player' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
            <div className="w-full max-w-xl bg-slate-50 dark:bg-slate-800/80 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  Câu {(autoPlayerIndex % SPOKEN_QA_PAIRS.length) + 1} / {SPOKEN_QA_PAIRS.length}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Tốc độ:</span>
                  <button
                    onClick={() => setPlaybackSpeed((prev) => (prev === 1.0 ? 0.75 : 1.0))}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    {playbackSpeed}x
                  </button>
                </div>
              </div>

              {/* Question */}
              <div className="space-y-1 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">
                  ❓ {activeAutoPair.question.speaker}
                </span>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeAutoPair.question.chinese}
                </div>
                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {activeAutoPair.question.pinyin}
                </div>
                <div className="text-xs text-slate-500 italic">
                  "{activeAutoPair.question.meaning}"
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-emerald-500 animate-bounce" />
              </div>

              {/* Response */}
              <div className="space-y-1 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  💬 {activeAutoPair.response.speaker}
                </span>
                <div className="text-2xl font-bold text-emerald-950 dark:text-emerald-100">
                  {activeAutoPair.response.chinese}
                </div>
                <div className="text-sm font-medium text-teal-600 dark:text-teal-300">
                  {activeAutoPair.response.pinyin}
                </div>
                <div className="text-xs text-emerald-800 dark:text-emerald-200 font-medium">
                  "{activeAutoPair.response.meaning}"
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() =>
                    setAutoPlayerIndex((prev) =>
                      prev === 0 ? SPOKEN_QA_PAIRS.length - 1 : prev - 1
                    )
                  }
                  className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 shadow-lg transition-all ${
                    isAutoPlaying
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
                  }`}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>Tạm dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Tự động phát tuần hoàn</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    setAutoPlayerIndex((prev) => (prev + 1) % SPOKEN_QA_PAIRS.length)
                  }
                  className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Đố Vui Phản Xạ Ứng Đáp */}
        {activeTab === 'quiz' && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
            {showQuizResult ? (
              <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 text-center shadow-2xl space-y-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Hoàn Thành Thử Thách!
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Bạn đã xuất sắc vượt qua các tình huống khẩu ngữ đời thực
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-around">
                  <div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {quizScore}
                    </div>
                    <div className="text-xs text-slate-500">Tổng điểm</div>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <div className="text-2xl font-black text-amber-500">
                      {Math.round((quizScore / (SPOKEN_QUIZ_LIST.length * 10)) * 100)}%
                    </div>
                    <div className="text-xs text-slate-500">Độ chính xác</div>
                  </div>
                </div>

                <button
                  onClick={handleResetQuiz}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại từ đầu</span>
                </button>
              </div>
            ) : (
              <div className="w-full max-w-xl bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
                {/* Quiz Header & Streak */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Câu hỏi {quizIndex + 1} / {SPOKEN_QUIZ_LIST.length}
                  </span>

                  {quizStreak > 1 && (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{quizStreak} combo!</span>
                    </div>
                  )}
                </div>

                {/* Scenario & Prompt */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 space-y-2">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    📍 Tình huống:
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {currentQuizItem.scenario}
                  </div>
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 pt-1">
                    👉 {currentQuizItem.prompt}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQuizItem.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuizItem.correctIndex;

                    let btnClass =
                      'w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between ';

                    if (!isQuizChecked) {
                      btnClass +=
                        'border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 text-slate-800 dark:text-slate-100';
                    } else if (isCorrect) {
                      btnClass +=
                        'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-100 font-bold';
                    } else if (isSelected) {
                      btnClass +=
                        'border-rose-500 bg-rose-100/70 dark:bg-rose-900/60 text-rose-950 dark:text-rose-100 font-bold';
                    } else {
                      btnClass +=
                        'border-slate-200 dark:border-slate-700 opacity-50 text-slate-600 dark:text-slate-400';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isQuizChecked}
                        onClick={() => handleSelectQuizOption(idx)}
                        className={btnClass}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-base font-bold">{opt}</span>
                        </div>
                        <button
                          onClick={(e) => handleSpeak(e, opt)}
                          className="p-1 rounded-lg text-slate-400 hover:text-emerald-600"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
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
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>
                        {quizIndex + 1 < SPOKEN_QUIZ_LIST.length ? 'Câu tiếp theo' : 'Xem kết quả'}
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
