import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, Eye, EyeOff, Check, RotateCcw, ChevronLeft, ChevronRight, ChevronUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';
import { storageService } from '../../utils/storage';

interface FlashcardViewProps {
  words: ChineseWord[];
  onUpdateWordSRS: (wordId: string, isCorrect: boolean) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ words, onUpdateWordSRS }) => {
  // Track cards that have been swiped as "đã thuộc" (persisted in storage)
  const [masteredWordIds, setMasteredWordIds] = useState<string[]>(() => {
    return storageService.getMasteredFlashcardIds();
  });

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

  // Filter out cards that the user has already mastered
  const unmasteredWords = useMemo(() => {
    const masteredSet = new Set(masteredWordIds);
    return words.filter((w) => !masteredSet.has(w.id));
  }, [words, masteredWordIds]);

  const deckMasteredCount = useMemo(() => {
    return words.length - unmasteredWords.length;
  }, [words, unmasteredWords]);

  const hasWords = Boolean(words && words.length > 0);
  const isDeckCompleted = hasWords && unmasteredWords.length === 0;

  // Safe index within the unmastered pool
  const safeIndex = unmasteredWords.length > 0 ? Math.min(currentIndex, unmasteredWords.length - 1) : 0;
  const currentWord = unmasteredWords.length > 0 ? unmasteredWords[safeIndex] : null;

  // Reset mastered cards so the user can study cards in this deck again
  const handleResetMastered = () => {
    audioService.playClick();
    audioService.playSuccessChime();
    // Only reset mastered status for words in the current deck
    const currentWordIds = new Set(words.map((w) => w.id));
    const remainingMastered = masteredWordIds.filter((id) => !currentWordIds.has(id));
    storageService.saveMasteredFlashcardIds(remainingMastered);
    setMasteredWordIds(remainingMastered);
    setCurrentIndex(0);
    setIsFlipped(false);
    setDragOffset(0);
    setDragOffsetY(0);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

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
    if (unmasteredWords.length === 0) return;
    setIsFlipped(false);
    setDragOffset(0);
    setDragOffsetY(0);
    setCurrentIndex((prev) => (prev + 1) % unmasteredWords.length);
  };

  const handlePrev = () => {
    if (unmasteredWords.length === 0) return;
    setIsFlipped(false);
    setDragOffset(0);
    setDragOffsetY(0);
    setCurrentIndex((prev) => (prev - 1 + unmasteredWords.length) % unmasteredWords.length);
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

      // Mark this card as mastered so it won't appear anymore!
      const newMastered = [...masteredWordIds, currentWord.id];
      setMasteredWordIds(newMastered);
      storageService.saveMasteredFlashcardIds(newMastered);
      onUpdateWordSRS(currentWord.id, true);

      setIsFlipped(false);
      setDragOffset(0);
      setDragOffsetY(0);

      const remaining = unmasteredWords.length - 1;
      if (remaining === 0) {
        // All cards finished! Grand celebration!
        setTimeout(() => {
          audioService.playSuccessChime();
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
          });
        }, 300);
        setCurrentIndex(0);
      } else if (safeIndex >= remaining) {
        setCurrentIndex(0);
      }
    } else {
      audioService.playErrorBuzz();
      onUpdateWordSRS(currentWord.id, false);

      // Card remains in unmastered queue for further review
      setIsFlipped(false);
      setDragOffset(0);
      setDragOffsetY(0);
      setCurrentIndex((prev) => (prev + 1) % unmasteredWords.length);
    }
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
    if (!hasWords || !currentWord) return;
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
  }, [safeIndex, isFlipped, unmasteredWords, hasWords, currentWord]);

  if (!hasWords) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <p className="text-slate-400">Chưa có từ vựng nào trong danh sách.</p>
      </div>
    );
  }

  // Celebration screen when all cards in deck have been mastered!
  if (isDeckCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] max-w-md w-full mx-auto p-6 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-rose-500 flex items-center justify-center shadow-xl shadow-emerald-900/30 text-white mb-5 animate-bounce">
          <Sparkles className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Xuất sắc! Bạn đã thuộc hết thẻ!</h2>
        <p className="text-xs text-slate-400 mb-2 leading-relaxed">
          Toàn bộ <span className="font-bold text-emerald-400">{words.length}</span> thẻ flashcard trong danh sách đã được bạn học thuộc và ghi nhớ thành công.
        </p>
        <p className="text-[11px] text-slate-500 mb-6">
          Các thẻ đã thuộc được ẩn đi. Khi muốn ôn tập lại từ đầu, bạn chỉ cần bấm nút bên dưới.
        </p>
        <button
          onClick={handleResetMastered}
          className="flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-900/40 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Học lại từ đầu (Reset)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 max-w-md w-full mx-auto p-4 pb-24">
      {/* Top Controls: Progress, Mastered Count, Reset & Peek Mask Toggles */}
      <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <span className="font-medium text-slate-300">
            Còn {unmasteredWords.length} thẻ
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-semibold">
            Đã thuộc: {deckMasteredCount}/{words.length}
          </span>
          {currentWord && (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
              Hộp SRS {currentWord.box || 1}
            </span>
          )}
        </div>

        {/* Peek Mask Toggles & Reset CTA */}
        <div className="flex items-center space-x-1.5">
          {deckMasteredCount > 0 && (
            <button
              onClick={handleResetMastered}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[11px] font-semibold transition-colors"
              title="Xóa danh sách đã thuộc, học lại các thẻ này từ đầu"
            >
              <RotateCcw className="w-3 h-3 text-rose-400" />
              <span>Reset</span>
            </button>
          )}

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

      {/* Progress Bar showing % cards mastered */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-emerald-500 to-rose-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${words.length > 0 ? (masteredWordIds.length / words.length) * 100 : 0}%` }}
        />
      </div>

      {currentWord && (
        <>
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
              className={`relative w-full h-full duration-500 transform-style-3d ${
                isFlipped ? 'rotate-x-180' : ''
              }`}
            >
              {/* Mặt trước: Hán tự, Pinyin, Hán Việt */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750/80 rounded-3xl p-6 flex flex-col justify-between shadow-2xl backface-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-rose-400 border border-slate-700/80 tracking-wide">
                    {currentWord.level}
                  </span>
                  <button
                    onClick={(e) => handleSpeak(e, currentWord.hanzi)}
                    className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors border border-slate-700 active:scale-95"
                    title="Phát âm từ"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Central Hanzi Display */}
                <div className="flex flex-col items-center justify-center my-auto py-2">
                  <span className="text-7xl sm:text-8xl font-bold text-slate-100 tracking-wider filter drop-shadow-md select-all">
                    {currentWord.hanzi}
                  </span>

                  {/* Pinyin */}
                  <div className="h-8 flex items-center justify-center mt-3">
                    {hidePinyin ? (
                      <span className="px-3 py-1 rounded-lg bg-slate-800/60 border border-dashed border-slate-700 text-slate-500 text-xs italic">
                        Pinyin bị ẩn
                      </span>
                    ) : (
                      <span className="text-xl sm:text-2xl font-semibold text-rose-400 pinyin-text tracking-wide">
                        {currentWord.pinyin}
                      </span>
                    )}
                  </div>

                  {/* Hanviet */}
                  <div className="h-6 flex items-center justify-center mt-1">
                    {hideHanviet ? (
                      <span className="px-2.5 py-0.5 rounded bg-slate-800/60 border border-dashed border-slate-700 text-slate-500 text-[10px] italic">
                        Hán Việt bị ẩn
                      </span>
                    ) : (
                      currentWord.hanviet && (
                        <span className="text-xs uppercase font-bold text-amber-300 tracking-widest px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                          {currentWord.hanviet}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 font-medium pt-2">
                  <ChevronUp className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                  <span>Vuốt lên để lật</span>
                </div>
              </div>

              {/* Mặt sau: Nghĩa & Ví dụ song ngữ */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750/80 rounded-3xl p-6 flex flex-col justify-between shadow-2xl backface-hidden rotate-x-180">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-slate-100">{currentWord.hanzi}</span>
                    <span className="text-sm text-rose-400 font-medium pinyin-text">{currentWord.pinyin}</span>
                  </div>
                  <button
                    onClick={(e) => handleSpeak(e, currentWord.hanzi)}
                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 transition-colors border border-slate-700"
                    title="Phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Meaning & Details */}
                <div className="flex-1 flex flex-col justify-center my-3 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Định nghĩa</span>
                    <p className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5 leading-snug">
                      {currentWord.meaning}
                    </p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-750">
                      {currentWord.pos}
                    </span>
                  </div>

                  {currentWord.examples && currentWord.examples.length > 0 && (
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold text-rose-400">Ví dụ câu:</span>
                        <button
                          onClick={(e) => handleSpeakSentence(e, currentWord.examples![0].zh)}
                          className="hover:text-slate-200 flex items-center gap-1"
                          title="Nghe câu ví dụ"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Nghe câu</span>
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-slate-100">{currentWord.examples[0].zh}</p>
                      <p className="text-xs text-rose-400/90 font-medium pinyin-text mt-0.5">
                        {currentWord.examples[0].pinyin}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 italic">{currentWord.examples[0].vi}</p>
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
        </>
      )}
    </div>
  );
};
