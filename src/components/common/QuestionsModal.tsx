import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Volume2,
  Sparkles,
  RotateCcw,
  HelpCircle,
  ArrowRight,
  Flame,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  PenTool,
  CheckCircle2,
  XCircle,
  MessageCircle,
} from 'lucide-react';
import {
  INTERROGATIVE_PRONOUNS,
  QUESTION_PATTERNS,
  QUESTION_MISTAKE_RULES,
  QUESTION_QUIZ_QUESTIONS,
  InterrogativePronoun,
} from '../../data/questionsData';
import { audioService } from '../../utils/audio';

interface QuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
}

export const QuestionsModal: React.FC<QuestionsModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'pronouns' | 'patterns' | 'rules' | 'quiz'>('pronouns');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPronoun, setSelectedPronoun] = useState<InterrogativePronoun>(INTERROGATIVE_PRONOUNS[0]);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Filtered pronouns
  const filteredPronouns = useMemo(() => {
    return INTERROGATIVE_PRONOUNS.filter((item) => {
      let matchCat = true;
      if (selectedCategory === 'thing_person') {
        matchCat = item.targetType === 'thing' || item.targetType === 'person';
      } else if (selectedCategory === 'manner_reason') {
        matchCat = item.targetType === 'manner' || item.targetType === 'reason' || item.targetType === 'quality';
      } else if (selectedCategory === 'quantity') {
        matchCat = item.targetType === 'quantity';
      } else if (selectedCategory === 'location') {
        matchCat = item.targetType === 'location';
      }

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchCat;

      const matchSearch =
        item.hanzi.toLowerCase().includes(term) ||
        item.pinyin.toLowerCase().includes(term) ||
        item.meaning.toLowerCase().includes(term) ||
        item.combinations.some((c) => c.toLowerCase().includes(term));

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

    const currentQ = QUESTION_QUIZ_QUESTIONS[quizIndex];
    if (idx === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 10);
      setQuizStreak((prev) => prev + 1);
    } else {
      setQuizStreak(0);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex + 1 < QUESTION_QUIZ_QUESTIONS.length) {
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

  const currentQ = QUESTION_QUIZ_QUESTIONS[quizIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Câu Hỏi & Đại Từ Nghi Vấn</h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-white/25 rounded-full uppercase tracking-wider">
                  疑问句宝典
                </span>
              </div>
              <p className="text-xs text-indigo-100 mt-0.5">
                Bảo điển 10 đại từ nghi vấn, 4 dạng câu hỏi cốt lõi và 4 đại kỵ ngữ pháp HSK 1 - 3
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 px-4 pt-2 gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('pronouns')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'pronouns'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-900 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            10 Đại Từ Nghi Vấn
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'patterns'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-900 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            4 Dạng Câu Hỏi Cốt Lõi
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-900 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            4 Đại Kỵ Bất Di Bất Dịch
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-900 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            Đố Vui Điền Câu ⚡
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PRONOUNS */}
          {activeTab === 'pronouns' && (
            <div className="space-y-6">
              {/* Search & Categories Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm đại từ (gì, ai, ở đâu, bao nhiêu, 什么, 谁...)"
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {[
                    { id: 'all', label: 'Tất cả (10)' },
                    { id: 'thing_person', label: 'Vật & Người' },
                    { id: 'location', label: 'Nơi chốn' },
                    { id: 'manner_reason', label: 'Cách thức / Lý do' },
                    { id: 'quantity', label: 'Số lượng / Kích thước' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pronoun Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPronouns.map((item) => {
                  const isSelected = selectedPronoun.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedPronoun(item);
                        audioService.speakChinese(item.hanzi);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md ring-1 ring-indigo-500'
                          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/60 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold font-kai text-indigo-800 dark:text-indigo-300">
                                {item.hanzi}
                              </span>
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                {item.pinyin}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {item.meaning}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
                            {item.targetLabel}
                          </span>
                          <button
                            onClick={(e) => handleSpeak(e, item.hanzi)}
                            className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 transition-colors"
                            title="Phát âm từ"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          {onSelectCharacter && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCharacter(item.hanzi[0]);
                                onClose();
                              }}
                              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 transition-colors"
                              title="Tập viết chữ này"
                            >
                              <PenTool className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Common Combinations */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.combinations.map((c, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Rule Tip */}
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-amber-50/60 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-100/80 dark:border-amber-900/30">
                        💡 <span className="font-semibold text-amber-800 dark:text-amber-300">Quy tắc vàng:</span>{' '}
                        {item.ruleTip}
                      </p>

                      {/* Q&A Dialog Box */}
                      <div className="mt-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 space-y-1.5">
                        {/* Question */}
                        <div className="text-xs">
                          <div className="flex items-center justify-between font-semibold text-gray-900 dark:text-gray-100">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-1">Q:</span>
                            <span className="flex-1">{item.example.question}</span>
                            <button
                              onClick={(e) => handleSpeak(e, item.example.question)}
                              className="text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform ml-2"
                              title="Nghe câu hỏi"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-indigo-700 dark:text-indigo-400 font-mono">
                            {item.example.pinyin}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">
                            {item.example.vietnamese}
                          </div>
                        </div>

                        {/* Answer */}
                        <div className="pt-1 border-t border-gray-200/60 dark:border-gray-700/60 text-xs">
                          <div className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-1">A:</span>
                            <span className="flex-1 font-medium">{item.example.answer}</span>
                            <button
                              onClick={(e) => handleSpeak(e, item.example.answer)}
                              className="text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform ml-2"
                              title="Nghe câu trả lời"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400">
                            {item.example.answerVietnamese}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: 4 QUESTION PATTERNS */}
          {activeTab === 'patterns' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-gray-800 dark:to-pink-950/30 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                      Bản Chất 4 Dạng Câu Hỏi Trong Tiếng Trung
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                      Tiếng Trung không dùng trợ động từ đảo ngữ như tiếng Anh. Để đặt câu hỏi, người bản xứ dùng 4
                      phương pháp chuẩn: <strong>Đặc vấn</strong> (thay từ để hỏi), <strong>Ngữ khí</strong> (thêm trợ từ
                      cuối câu 吗/呢/吧), <strong>Chính - Phản</strong> (ghép khẳng định và phủ định) hoặc{' '}
                      <strong>Lựa chọn</strong> (liên từ 还是).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {QUESTION_PATTERNS.map((pat) => (
                  <div
                    key={pat.id}
                    className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-2.5">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{pat.title}</h4>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          {pat.categoryLabel}
                        </span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
                        {pat.formula}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {pat.explanation}
                    </p>

                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                      ⚡ <strong>Lưu ý cốt tử:</strong> {pat.goldenRule}
                    </div>

                    {/* Dialogue Examples */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {pat.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 text-xs space-y-1.5"
                        >
                          <div>
                            <div className="flex items-center justify-between font-bold text-indigo-800 dark:text-indigo-300">
                              <span>Q: {ex.qChinese}</span>
                              <button
                                onClick={(e) => handleSpeak(e, ex.qChinese)}
                                className="text-indigo-600 hover:scale-110 transition-transform ml-1"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                              {ex.qPinyin}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">{ex.qVietnamese}</div>
                          </div>

                          <div className="pt-1.5 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                              <span>A: {ex.aChinese}</span>
                              <button
                                onClick={(e) => handleSpeak(e, ex.aChinese)}
                                className="text-emerald-600 hover:scale-110 transition-transform ml-1"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{ex.aVietnamese}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 4 GOLDEN RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>
                  <strong>Lưu ý quan trọng:</strong> 4 đại kỵ dưới đây chiếm đến 90% lỗi sai của người học khi đặt câu
                  hỏi tiếng Trung trong các bài thi nói và thi viết HSK 1 - 3!
                </span>
              </div>

              <div className="space-y-4">
                {QUESTION_MISTAKE_RULES.map((rule, idx) => (
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
                  <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-800/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Câu hỏi:</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-xs">
                        {quizIndex + 1} / {QUESTION_QUIZ_QUESTIONS.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold">
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
                        <span>Combo: {quizStreak}</span>
                      </div>
                      <div className="text-indigo-700 dark:text-indigo-300 font-mono">
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
                        <div className="flex items-center justify-between font-bold text-base text-indigo-800 dark:text-indigo-300 font-kai">
                          <span>{currentQ.sentence}</span>
                          <button
                            onClick={(e) => handleSpeak(e, currentQ.sentence)}
                            className="text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform ml-2"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">{currentQ.pinyin}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{currentQ.vietnamese}</div>
                      </div>
                    )}

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {currentQ.options.map((opt, idx) => {
                        let btnStyle =
                          'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-400 text-gray-800 dark:text-gray-200';
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
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isQuizChecked && idx === currentQ.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                            )}
                            {isQuizChecked && idx === selectedOption && idx !== currentQ.correctIndex && (
                              <XCircle className="w-4 h-4 text-red-600 shrink-0 ml-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {isQuizChecked && (
                      <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 animate-fadeIn">
                        <div className="font-bold mb-1 flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
                          <Lightbulb className="w-4 h-4" />
                          <span>Giải thích chi tiết:</span>
                        </div>
                        <p className="leading-relaxed">{currentQ.explanation}</p>
                      </div>
                    )}
                  </div>

                  {/* Next Question Button */}
                  {isQuizChecked && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleNextQuizQuestion}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                      >
                        <span>{quizIndex + 1 < QUESTION_QUIZ_QUESTIONS.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Quiz Result Scorecard */
                <div className="max-w-md mx-auto text-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl space-y-4 animate-scaleUp">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Hoàn Thành Đố Vui Đặt Câu Hỏi!
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Bạn đã chinh phục hệ thống 4 dạng câu hỏi và đại từ nghi vấn
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/40">
                    <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                      {quizScore} / {QUESTION_QUIZ_QUESTIONS.length * 10}
                    </div>
                    <div className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold mt-1">
                      {quizScore >= 80 ? '🌟 Bậc Thầy Phản Xạ Đặt Câu Hỏi HSK!' : '💪 Rất tốt! Hãy ôn lại các đại kỵ nhé!'}
                    </div>
                  </div>

                  <button
                    onClick={handleResetQuiz}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
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
