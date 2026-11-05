import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Eye, EyeOff, Check, RotateCcw, ChevronLeft, ChevronRight, ChevronUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';

interface FlashcardViewProps {
  words: ChineseWord[];
  onUpdateWordSRS: (wordId: string, isCorrect: boolean) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ words, onUpdateWordSRS }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hidePinyin, setHidePinyin] = useState(false);
  const [hideHanviet, setHideHanviet] = useState(false);

  // Swipe gesture state
  const [dragOffset, setDragOffset] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const lastTouchEndRef = useRef<number>(0);

  const hasWords = Boolean(words && words.length > 0);
  const currentWord = hasWords ? (words[currentIndex] || words[0]) : null;

  const handleFlip = () => {
    audioService.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.playClick();
    audioService.speakChinese(text);
  };

  const handleSpeakSentence = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakChinese(text);
  };

  const handleNext = () => {
    if (!hasWords) return;
    setIsFlipped(false);
    setDragOffset(0);
    setDragOffsetY(0);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrev = () => {
    if (!hasWords) return;
    setIsFlipped(false);
    setDragOffset(0);
    setDragOffsetY(0);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentWord) return;
    audioService.stopSpeech();
    if (isCorrect) {
      audioService.playSuccessChime();
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
      });
    } else {
      audioService.playErrorBuzz();
    }

    onUpdateWordSRS(currentWord.id, isCorrect);
    handleNext();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isHorizontalSwipeRef.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalSwipeRef.current === true) {
      setDragOffset(deltaX);
    } else if (isHorizontalSwipeRef.current === false) {
      setDragOffsetY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchEndRef.current = Date.now();

    if (isHorizontalSwipeRef.current === true) {
      if (dragOffset > 70) {
        // Vuốt sang phải -> Đã thuộc
        handleAnswer(true);
      } else if (dragOffset < -70) {
        // Vuốt sang trái -> Chưa nhớ
        handleAnswer(false);
      }
    } else if (isHorizontalSwipeRef.current === false) {
      // Vuốt dọc (lên hoặc xuống)
      if (Math.abs(dragOffsetY) > 30) {
        handleFlip();
      }
    } else {
      // Chạm nhẹ (Tap)
      if (Math.abs(dragOffset) < 10 && Math.abs(dragOffsetY) < 10) {
        handleFlip();
      }
    }

    setDragOffset(0);
    setDragOffsetY(0);
    isHorizontalSwipeRef.current = null;
  };

  useEffect(() => {
    if (!hasWords) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
        audioService.playClick();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleAnswer(true);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleAnswer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      audioService.stopSpeech();
    };
  }, [currentIndex, isFlipped, words, hasWords, currentWord]);

  if (!hasWords || !currentWord) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <p className="text-slate-400">Chưa có từ vựng nào trong danh sách.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 max-w-md w-full mx-auto p-4 pb-24">
      {/* Top Controls: Progress & Peek Mask Toggles */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-slate-300">
            {currentIndex + 1} / {words.length}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Hộp SRS {currentWord.box || 1}
          </span>
        </div>

        {/* Peek Mask Toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              audioService.playClick();
              setHidePinyin(!hidePinyin);
            }}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg border transition-colors ${
              hidePinyin
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Ẩn/Hiện Pinyin"
          >
            {hidePinyin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Pinyin</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              setHideHanviet(!hideHanviet);
            }}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg border transition-colors ${
              hideHanviet
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Ẩn/Hiện Hán Việt"
          >
            {hideHanviet ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Hán Việt</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* 3D Flashcard Container with Touch Swipe Support */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (Date.now() - lastTouchEndRef.current < 450) return;
          if (Math.abs(dragOffset) < 5 && Math.abs(dragOffsetY) < 5) {
            handleFlip();
          }
        }}
        style={{
          transform: `translateX(${dragOffset}px) translateY(${dragOffsetY * 0.25}px) rotate(${dragOffset * 0.04}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="relative w-full aspect-[4/5] min-h-[350px] max-h-[460px] perspective-1000 cursor-pointer select-none touch-none"
      >
        {/* Swipe Up Pill Feedback */}
        {dragOffsetY < -25 && (
          <div className="absolute top-4 inset-x-0 mx-auto w-fit z-40 px-3.5 py-1.5 rounded-2xl bg-sky-500 text-white font-bold text-xs shadow-xl animate-pulse flex items-center gap-1">
            <ChevronUp className="w-3.5 h-3.5" />
            <span>VUỐT LÊN ĐỂ LẬT</span>
          </div>
        )}
        {/* Swipe Pill Feedback */}
        {dragOffset > 35 && (
          <div className="absolute top-4 right-4 z-40 px-3.5 py-1.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-xl animate-pulse">
            ĐÃ THUỘC →
          </div>
        )}
        {dragOffset < -35 && (
          <div className="absolute top-4 left-4 z-40 px-3.5 py-1.5 rounded-2xl bg-rose-500 text-white font-bold text-xs shadow-xl animate-pulse">
            ← CHƯA NHỚ
          </div>
        )}

        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-3xl ${
            isFlipped ? 'rotate-x-180' : ''
          }`}
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 p-6 flex flex-col justify-between shadow-2xl shadow-black/40">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {currentWord.pos}
              </span>
              <button
                onClick={(e) => handleSpeak(e, currentWord.hanzi)}
                className="p-2.5 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-95"
                title="Nghe phát âm"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Central Hanzi Display */}
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="text-6xl font-bold text-slate-100 tracking-wider mb-3 select-all">
                {currentWord.hanzi}
              </div>

              {/* Pinyin (Maskable) */}
              <div className="mb-2">
                {hidePinyin ? (
                  <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-500 text-sm italic border border-slate-700/50">
                    (Pinyin ẩn - Vuốt lên để lật)
                  </span>
                ) : (
                  <span className="text-xl font-medium text-rose-400 pinyin-text tracking-normal">
                    {currentWord.pinyin}
                  </span>
                )}
              </div>

              {/* Hán Việt (Maskable) */}
              <div>
                {hideHanviet ? (
                  <span className="px-2 py-0.5 text-xs text-slate-500 italic">
                    [Âm Hán Việt ẩn]
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-widest">
                    {currentWord.hanviet}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom hint */}
            <div className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 font-medium">
              <ChevronUp className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span>Vuốt lên để lật</span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-x-180 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-rose-500/30 p-6 flex flex-col justify-between shadow-2xl shadow-black/40 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-100">{currentWord.hanzi}</span>
                  <span className="text-sm text-rose-400 font-medium pinyin-text tracking-normal">{currentWord.pinyin}</span>
                </div>
                <button
                  onClick={(e) => handleSpeak(e, currentWord.hanzi)}
                  className="p-2 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Hán Việt & Nghĩa */}
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
                  Âm Hán Việt: {currentWord.hanviet}
                </div>
                <div className="text-lg font-medium text-slate-100">{currentWord.meaning}</div>
                {currentWord.radical && (
                  <div className="mt-1 text-xs text-slate-400">
                    Bộ thủ: <span className="text-slate-200">{currentWord.radical}</span>
                    {currentWord.strokeCount && ` (${currentWord.strokeCount} nét)`}
                  </div>
                )}
              </div>

              {/* Examples */}
              {currentWord.examples && currentWord.examples.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-rose-400" /> Câu ví dụ:
                  </div>
                  <div className="space-y-2">
                    {currentWord.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => handleSpeakSentence(e, ex.zh)}
                        className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-100">{ex.zh}</div>
                          <div className="text-xs text-rose-400 pinyin-text tracking-normal mt-0.5">{ex.pinyin}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{ex.vi}</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleSpeakSentence(e, ex.zh)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-transform active:scale-90 shrink-0 flex items-center gap-1"
                          title="Nghe câu ví dụ"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span className="text-[10px] font-semibold">Nghe</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 font-medium pt-2">
              <ChevronUp className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span>Vuốt lên để lật</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: SRS Rating & Navigation */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => handleAnswer(false)}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-300 border border-slate-700 active:scale-98 transition-all font-medium text-sm"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>Chưa nhớ (Ôn lại)</span>
        </button>

        <button
          onClick={() => handleAnswer(true)}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium text-sm shadow-lg shadow-rose-900/30 active:scale-98 transition-all"
        >
          <Check className="w-4 h-4" />
          <span>Đã thuộc (Nhớ rõ)</span>
        </button>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-between mt-3 text-slate-400">
        <button
          onClick={() => {
            audioService.playClick();
            handlePrev();
          }}
          className="p-2 rounded-lg hover:bg-slate-800 flex items-center text-xs"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Từ trước
        </button>
        <button
          onClick={() => {
            audioService.playClick();
            handleNext();
          }}
          className="p-2 rounded-lg hover:bg-slate-800 flex items-center text-xs"
        >
          Từ sau <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Swipe Gesture Hint */}
      <div className="text-center text-[11px] text-slate-500 mt-2.5 select-none">
        Mẹo: Vuốt lên để lật • Vuốt sang phải (Đã thuộc) • Vuốt sang trái (Chưa nhớ)
      </div>
    </div>
  );
};
