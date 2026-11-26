import React, { useState } from 'react';
import {
  X,
  Compass,
  Volume2,
  Check,
  AlertTriangle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import {
  MASTER_WORD_ORDER_FORMULA,
  WORD_ORDER_PRINCIPLES,
  BIG_TO_SMALL_ITEMS,
  FOUR_GOLDEN_TABOOS,
  WORD_ORDER_QUIZ_LIST,
  type WordOrderQuizItem,
} from '../../data/wordOrderData';
import { audioService } from '../../utils/audio';

interface WordOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordOrderModal: React.FC<WordOrderModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'principles' | 'taboos' | 'quiz'>('principles');
  const [selectedPrincipleId, setSelectedPrincipleId] = useState<string>(
    WORD_ORDER_PRINCIPLES[0].id
  );

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  if (!isOpen) return null;

  const currentPrinciple =
    WORD_ORDER_PRINCIPLES.find((p) => p.id === selectedPrincipleId) ||
    WORD_ORDER_PRINCIPLES[0];

  const currentQuiz: WordOrderQuizItem = WORD_ORDER_QUIZ_LIST[currentQuizIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    audioService.playClick();
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuiz.correctIndex;
    if (isCorrect) {
      audioService.playSuccessChime();
      setScore((prev) => prev + 10 + streak * 2);
      setStreak((prev) => prev + 1);
    } else {
      audioService.playErrorBuzz();
      setStreak(0);
    }
  };

  const handleNextQuiz = () => {
    audioService.playClick();
    if (currentQuizIndex < WORD_ORDER_QUIZ_LIST.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    audioService.playClick();
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsQuizFinished(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-3xl shadow-2xl flex flex-col max-h-[94dvh] h-[94dvh] sm:h-auto overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-900/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-slate-100 leading-tight">
                  Trật Tự Từ Trong Câu
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Cú pháp Vàng
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Khẩu quyết S - T - P - M - V - O - C • Tránh dịch Word-by-word
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors active:scale-90 flex items-center justify-center touch-manipulation select-none"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 p-2 bg-slate-850 border-b border-slate-800 gap-1.5 text-xs shrink-0">
          <button
            data-testid="word-order-tab-principles"
            onClick={() => {
              audioService.playClick();
              setActiveTab('principles');
            }}
            className={`min-h-[44px] py-2 px-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 touch-manipulation select-none ${
              activeTab === 'principles'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>6 Quy Tắc Cốt Lõi</span>
          </button>

          <button
            data-testid="word-order-tab-taboos"
            onClick={() => {
              audioService.playClick();
              setActiveTab('taboos');
            }}
            className={`min-h-[44px] py-2 px-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 touch-manipulation select-none ${
              activeTab === 'taboos'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>4 Đại Kỵ & So Sánh</span>
          </button>

          <button
            data-testid="word-order-tab-quiz"
            onClick={() => {
              audioService.playClick();
              setActiveTab('quiz');
            }}
            className={`min-h-[44px] py-2 px-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 touch-manipulation select-none ${
              activeTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đố Vui Cú Pháp ⚡</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: 6 QUY TẮC CỐT LÕI */}
          {activeTab === 'principles' && (
            <div className="space-y-4 animate-fadeIn">
              {/* MASTER FORMULA HERO BANNER */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-850 to-rose-950/40 border-2 border-amber-500/40 shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Khẩu Quyết Trật Tự Từ Thần Thánh
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    S - T - P - M - V - O
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-extrabold text-white leading-relaxed mb-2.5">
                  {MASTER_WORD_ORDER_FORMULA.rhyme}
                </div>

                {/* Interactive visual chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {MASTER_WORD_ORDER_FORMULA.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-750 flex flex-col items-center"
                    >
                      <span className="text-[9px] text-slate-400 font-medium">
                        {item.label}
                      </span>
                      <span className={`text-xs font-bold ${item.color}`}>
                        {item.word}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Example sentence with speaker */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-750 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-amber-200">
                      {MASTER_WORD_ORDER_FORMULA.chineseFullExample}
                    </div>
                    <div className="text-[11px] text-rose-300 pinyin-text">
                      {MASTER_WORD_ORDER_FORMULA.pinyinFullExample}
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      {MASTER_WORD_ORDER_FORMULA.meaningFullExample}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      audioService.speakChinese(
                        MASTER_WORD_ORDER_FORMULA.chineseFullExample
                      )
                    }
                    className="w-11 h-11 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center justify-center transition-all active:scale-90 touch-manipulation select-none shrink-0"
                    title="Nghe câu mẫu chuẩn"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Selector for 6 Principles */}
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                  Chọn 1 trong 6 quy tắc để xem phân tích chuyên sâu:
                </label>
                <div className="flex gap-2 overflow-x-auto touch-scroll-x pb-1 scrollbar-none">
                  {WORD_ORDER_PRINCIPLES.map((principle) => {
                    const isSelected = principle.id === selectedPrincipleId;
                    return (
                      <button
                        key={principle.id}
                        type="button"
                        onClick={() => {
                          audioService.playClick();
                          setSelectedPrincipleId(principle.id);
                        }}
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 touch-manipulation select-none shrink-0 border ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-900/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {principle.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail Card of Selected Principle */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-750 space-y-3.5 shadow-md">
                <div className="flex items-start justify-between gap-2 border-b border-slate-700/80 pb-2.5">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 mr-2">
                      {currentPrinciple.level}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
                      {currentPrinciple.title}
                    </h3>
                    <p className="text-xs text-amber-300 font-semibold mt-0.5">
                      💡 Khẩu quyết: {currentPrinciple.mnemonic}
                    </p>
                  </div>
                </div>

                {/* Formula Box */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-750">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Công thức cú pháp:
                  </div>
                  <div className="text-xs sm:text-sm font-black text-rose-300 font-mono">
                    {currentPrinciple.formula}
                  </div>
                </div>

                {/* Explanation & Golden Tip */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentPrinciple.explanation}
                </p>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-medium">
                  ⭐ <strong className="text-amber-300">Mẹo vàng:</strong>{' '}
                  {currentPrinciple.goldenTip}
                </div>

                {/* Example Sentences List */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Các câu ví dụ tiêu biểu:</span>
                  </div>
                  {currentPrinciple.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-750 flex items-center justify-between gap-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-white">
                          {ex.chinese}
                        </div>
                        <div className="text-xs text-rose-300 pinyin-text mt-0.5">
                          {ex.pinyin}
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          {ex.meaning}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          Phân tích: {ex.breakdown}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => audioService.speakChinese(ex.chinese)}
                        className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 flex items-center justify-center transition-all active:scale-90 touch-manipulation select-none shrink-0"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Contrast Card: Wrong vs Right */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-750 space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>So sánh bẫy lỗi thường gặp:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200">
                      <div className="font-bold text-rose-400 flex items-center gap-1">
                        <span>❌ Sai (Dịch bám tiếng Việt):</span>
                      </div>
                      <div className="font-bold text-sm mt-1">{currentPrinciple.mistakeComparison.wrong}</div>
                      <div className="text-[10px] text-rose-300/80 mt-0.5">{currentPrinciple.mistakeComparison.wrongPinyin}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                      <div className="font-bold text-emerald-400 flex items-center gap-1">
                        <span>✓ Đúng (Chuẩn tiếng Trung):</span>
                      </div>
                      <div className="font-bold text-sm mt-1">{currentPrinciple.mistakeComparison.right}</div>
                      <div className="text-[10px] text-emerald-300/80 mt-0.5">{currentPrinciple.mistakeComparison.rightPinyin}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1 leading-snug">
                    🔍 <strong>Nguyên nhân:</strong> {currentPrinciple.mistakeComparison.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 4 ĐẠI KỴ & QUY TẮC LỚN ĐẾN BÉ */}
          {activeTab === 'taboos' && (
            <div className="space-y-4 animate-fadeIn">
              {/* 4 Golden Taboos */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>4 Đại Kỵ Bất Di Bất Dịch Trong Trật Tự Từ</span>
                </h3>
                {FOUR_GOLDEN_TABOOS.map((taboo) => (
                  <div
                    key={taboo.id}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-750 space-y-2.5 shadow-xs"
                  >
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span>{taboo.name}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 font-bold">
                        {taboo.wrong}
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-between">
                        <span>{taboo.right}</span>
                        <button
                          type="button"
                          onClick={() => audioService.speakChinese(taboo.right.replace(/[✓\s]/g, ''))}
                          className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center transition-all active:scale-90 shrink-0"
                          title="Nghe câu đúng"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 flex items-start gap-1 leading-snug">
                      <span className="text-amber-400 font-bold">Lưu ý:</span>
                      <span>{taboo.explanation}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Big to Small principle */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Nguyên Tắc "Từ Lớn Đến Bé" (Big to Small Principle)</span>
                </h3>
                {BIG_TO_SMALL_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-750 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-200">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.description}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-white">{item.chinese}</div>
                        <div className="text-xs text-rose-300 pinyin-text mt-0.5">{item.pinyin}</div>
                        <div className="text-xs text-slate-300 mt-0.5">{item.vietnamese}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => audioService.speakChinese(item.chinese)}
                        className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 flex items-center justify-center transition-all active:scale-90 touch-manipulation select-none shrink-0"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      💡 {item.orderExplanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ĐỐ VUI TRẮC NGHIỆM ⚡ */}
          {activeTab === 'quiz' && (
            <div className="space-y-4 animate-fadeIn">
              {!isQuizFinished ? (
                <div className="space-y-4">
                  {/* Progress & Score Bar */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-750 text-xs">
                    <span className="font-bold text-slate-300">
                      Câu {currentQuizIndex + 1} / {WORD_ORDER_QUIZ_LIST.length}
                    </span>
                    <div className="flex items-center space-x-3">
                      {streak >= 2 && (
                        <span className="text-amber-400 font-extrabold flex items-center gap-0.5 animate-pulse">
                          🔥 Combo x{streak}
                        </span>
                      )}
                      <span className="font-black text-amber-300 text-sm">
                        {score} điểm
                      </span>
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-750 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Quy tắc kiểm tra: {currentQuiz.ruleTested}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white">
                      {currentQuiz.question}
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 font-medium">
                      Ý nghĩa tiếng Việt: <strong className="text-amber-200">"{currentQuiz.promptMeaning}"</strong>
                    </div>
                  </div>

                  {/* 4 Touch-Optimized Options */}
                  <div className="space-y-2.5">
                    {currentQuiz.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQuiz.correctIndex;
                      let btnStyle =
                        'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-200';

                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle =
                            'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-950/40 font-bold';
                        } else if (isSelected) {
                          btnStyle =
                            'bg-rose-500/20 border-rose-500/60 text-rose-200 shadow-md shadow-rose-950/40';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-amber-500 bg-amber-500/10 text-white';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full min-h-[56px] p-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-center justify-between gap-3 touch-manipulation select-none ${btnStyle}`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <span className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold leading-snug">
                              {opt}
                            </span>
                          </div>
                          {isAnswered && isCorrect && (
                            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                          )}
                          {isAnswered && isSelected && !isCorrect && (
                            <X className="w-5 h-5 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation & Next CTA */}
                  {isAnswered && (
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-750 space-y-3 animate-fadeIn">
                      <div className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-amber-300">Giải thích chi tiết: </strong>
                        {currentQuiz.explanation}
                      </div>
                      <button
                        type="button"
                        onClick={handleNextQuiz}
                        className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950/40 flex items-center justify-center space-x-2 transition-all active:scale-95 touch-manipulation select-none"
                      >
                        <span>
                          {currentQuizIndex < WORD_ORDER_QUIZ_LIST.length - 1
                            ? 'CÂU TIẾP THEO'
                            : 'XEM KẾT QUẢ ĐỐ VUI'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* QUIZ SCORECARD */
                <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-750 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-amber-950/50">
                    <Award className="w-9 h-9" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">
                      Hoàn Thành Đố Vui Cú Pháp!
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Bạn đã nắm vững khẩu quyết trật tự từ tiếng Trung
                    </p>
                  </div>
                  <div className="text-3xl font-black text-amber-400 tabular-nums">
                    {score} Điểm
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-750">
                      <div className="text-slate-400 text-[10px]">Số câu đúng</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">
                        {Math.round(score / 10)} / {WORD_ORDER_QUIZ_LIST.length}
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-750">
                      <div className="text-slate-400 text-[10px]">Đánh giá</div>
                      <div className="text-base font-bold text-amber-300 mt-0.5">
                        {score >= 80 ? 'Bậc Thầy Cú Pháp 🏆' : 'Cần Rèn Luyện Thêm 📚'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('principles')}
                      className="min-h-[48px] py-3 px-4 rounded-2xl bg-slate-750 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-600/60 transition-all active:scale-95 touch-manipulation select-none"
                    >
                      Xem lại lý thuyết
                    </button>
                    <button
                      type="button"
                      onClick={handleRestartQuiz}
                      className="min-h-[48px] py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-950/40 transition-all active:scale-95 touch-manipulation select-none"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Thử thách lại</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-850/90 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Khẩu quyết: <strong>S + T + P + M + V + O + C</strong>
          </span>
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 transition-all active:scale-95 touch-manipulation select-none"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
