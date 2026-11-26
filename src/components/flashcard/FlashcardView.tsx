import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, Eye, EyeOff, Check, RotateCcw, ChevronLeft, ChevronRight, ChevronUp, Sparkles, Headphones, Pause, Shuffle, ArrowLeftRight } from 'lucide-react';
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
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIds, setShuffledIds] = useState<string[]>([]);
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [lastMasteredWord, setLastMasteredWord] = useState<ChineseWord | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  // Hands-free Audio Player state
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState<'normal' | 'slow'>('normal');
  const autoPlayTimerRef = useRef<number | null>(null);
  const isAutoPlayRef = useRef<boolean>(false);

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

  // Deck order (supports random shuffle without in-place mutation)
  const studyWords = useMemo(() => {
    if (!isShuffled || shuffledIds.length === 0) {
      return unmasteredWords;
    }
    const map = new Map(unmasteredWords.map((w) => [w.id, w]));
    const result: ChineseWord[] = [];
    for (const id of shuffledIds) {
      const w = map.get(id);
      if (w) result.push(w);
    }
    for (const w of unmasteredWords) {
      if (!map.has(w.id)) {
        result.push(w);
      }
    }
    return result.length > 0 ? result : unmasteredWords;
  }, [isShuffled, shuffledIds, unmasteredWords]);

  const deckMasteredCount = useMemo(() => {
    return words.length - unmasteredWords.length;
  }, [words, unmasteredWords]);

  const hasWords = Boolean(words && words.length > 0);
  const isDeckCompleted = hasWords && unmasteredWords.length === 0;

  // Safe index within the study pool
  const safeIndex = studyWords.length > 0 ? Math.min(currentIndex, studyWords.length - 1) : 0;
  const currentWord = studyWords.length > 0 ? studyWords[safeIndex] : null;

  const handleToggleShuffle = () => {
    audioService.playClick();
    const next = !isShuffled;
    setIsShuffled(next);
    if (next && unmasteredWords.length > 0) {
      const ids = unmasteredWords.map((w) => w.id);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      setShuffledIds(ids);
    } else {
      setShuffledIds([]);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleToggleReverse = () => {
    audioService.playClick();
    setIsReverseMode((prev) => !prev);
    setIsFlipped(false);
  };

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
    storageService.recordStudyActivity();
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

  // Sync mastered IDs from storage when words deck changes (e.g. after backup restore or reset)
  useEffect(() => {
    setMasteredWordIds(storageService.getMasteredFlashcardIds());
  }, [words]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    };
  }, []);

  const handleUndoMastered = () => {
    if (!lastMasteredWord) return;
    audioService.playClick();
    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    const restoredId = lastMasteredWord.id;
    const newMastered = masteredWordIds.filter((id) => id !== restoredId);
    setMasteredWordIds(newMastered);
    storageService.saveMasteredFlashcardIds(newMastered);
    setLastMasteredWord(null);
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (studyWords.length === 0) return;
    setIsFlipped(false);
    setDragOffset(0);
    setDragOffsetY(0);
    setCurrentIndex((safeIndex + 1) % studyWords.length);
  };

  const handlePrev = () => {
    if (studyWords.length === 0) return;
    setIsFlipped(false);
    setDragOffset(0);
    setDragOffsetY(0);
    setCurrentIndex((safeIndex - 1 + studyWords.length) % studyWords.length);
  };

  // Hands-free Audio Player loop
  useEffect(() => {
    isAutoPlayRef.current = isAutoPlay;
    if (!isAutoPlay || !currentWord || isDeckCompleted) {
      if (autoPlayTimerRef.current) {
        window.clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      if (!isAutoPlay) {
        audioService.stopSpeech();
      }
      return;
    }

    let isMounted = true;
    storageService.recordStudyActivity();

    // Step 1: Speak character on front if not in reverse mode
    if (!isReverseMode) {
      audioService.speakChinese(currentWord.hanzi);
    }

    // MediaSession metadata
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: isReverseMode ? currentWord.meaning : `${currentWord.hanzi} (${currentWord.pinyin})`,
          artist: isReverseMode ? `${currentWord.hanzi} (${currentWord.pinyin})` : currentWord.meaning,
          album: 'HanziFlow HSK 1 Luyện Nghe',
        });
      } catch {}
    }

    const flipDelay = autoPlaySpeed === 'slow' ? 2400 : 1800;
    const nextCardDelay = autoPlaySpeed === 'slow' ? 3600 : 2800;

    autoPlayTimerRef.current = window.setTimeout(() => {
      if (!isMounted || !isAutoPlayRef.current) return;
      setIsFlipped(true);

      // In reverse mode, reveal and speak Chinese character on flip
      if (isReverseMode) {
        audioService.speakChinese(currentWord.hanzi);
      }

      // Read example if exists
      if (currentWord.examples && currentWord.examples.length > 0) {
        window.setTimeout(() => {
          if (!isMounted || !isAutoPlayRef.current) return;
          audioService.speakChinese(currentWord.examples![0].zh);
        }, isReverseMode ? 1000 : 0);
      }

      autoPlayTimerRef.current = window.setTimeout(() => {
        if (!isMounted || !isAutoPlayRef.current) return;
        setIsFlipped(false);
        setCurrentIndex((prev) => {
          if (studyWords.length === 0) return 0;
          return (prev + 1) % studyWords.length;
        });
      }, nextCardDelay);
    }, flipDelay);

    return () => {
      isMounted = false;
      if (autoPlayTimerRef.current) {
        window.clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [isAutoPlay, safeIndex, studyWords.length, autoPlaySpeed, isDeckCompleted, currentWord, isReverseMode]);

  useEffect(() => {
    if (isDeckCompleted && isAutoPlay) {
      setIsAutoPlay(false);
    }
  }, [isDeckCompleted, isAutoPlay]);

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentWord) return;
    audioService.stopSpeech();

    if (isCorrect) {
      audioService.playSuccessChime();
      try {
        navigator.vibrate?.(15);
      } catch {}
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
      });

      // Track last mastered word for instant Undo
      setLastMasteredWord(currentWord);
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = window.setTimeout(() => setLastMasteredWord(null), 5000);

      // Mark this card as mastered (deduplicated) so it won't appear anymore!
      const newMastered = Array.from(new Set([...masteredWordIds, currentWord.id]));
      setMasteredWordIds(newMastered);
      storageService.saveMasteredFlashcardIds(newMastered);
      onUpdateWordSRS(currentWord.id, true);

      setIsFlipped(false);
      setDragOffset(0);
      setDragOffsetY(0);

      const remaining = studyWords.length - 1;
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
      } else {
        setCurrentIndex(safeIndex);
      }
    } else {
      audioService.playErrorBuzz();
      try {
        navigator.vibrate?.([20, 30, 20]);
      } catch {}
      setLastMasteredWord(null);
      onUpdateWordSRS(currentWord.id, false);

      // Card remains in unmastered queue for further review
      setIsFlipped(false);
      setDragOffset(0);
      setDragOffsetY(0);
      setCurrentIndex((safeIndex + 1) % studyWords.length);
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
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (document.querySelector('.fixed.inset-0')) return;
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
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        handleToggleShuffle();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleToggleReverse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      audioService.stopSpeech();
    };
  }, [safeIndex, isFlipped, studyWords, hasWords, currentWord, isShuffled, isReverseMode]);

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
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {lastMasteredWord && (
            <button
              onClick={handleUndoMastered}
              className="flex items-center space-x-1.5 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all active:scale-95 shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hoàn tác ({lastMasteredWord.hanzi})</span>
            </button>
          )}
          <button
            onClick={handleResetMastered}
            className="flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-900/40 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Học lại từ đầu (Reset)</span>
          </button>
        </div>
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

        {/* Peek Mask, Shuffle, Reverse & Autoplay Toggles */}
        <div className="flex items-center space-x-1.5 overflow-x-auto touch-scroll-x pb-0.5 scrollbar-none text-xs">
          {deckMasteredCount > 0 && (
            <button
              onClick={handleResetMastered}
              className="flex items-center space-x-1 min-h-[36px] px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all active:scale-95 touch-manipulation whitespace-nowrap"
              title="Xóa danh sách đã thuộc, học lại các thẻ này từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset</span>
            </button>
          )}

          <button
            data-testid="toggle-shuffle-btn"
            onClick={handleToggleShuffle}
            className={`flex items-center space-x-1 min-h-[36px] px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 touch-manipulation whitespace-nowrap ${
              isShuffled
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 active:bg-slate-700'
            }`}
            title={isShuffled ? 'Đang xáo ngẫu nhiên. Bấm để trở về thứ tự mặc định' : 'Xáo trộn ngẫu nhiên thứ tự thẻ flashcard (phím S)'}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Xáo</span>
          </button>

          <button
            data-testid="toggle-reverse-btn"
            onClick={handleToggleReverse}
            className={`flex items-center space-x-1 min-h-[36px] px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 touch-manipulation whitespace-nowrap ${
              isReverseMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 active:bg-slate-700'
            }`}
            title={isReverseMode ? 'Đang đảo mặt (Active Recall). Bấm để trở về mặt Hán tự trước' : 'Đảo mặt thẻ: Nhìn nghĩa đoán Hán tự & Pinyin (phím R)'}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Đảo mặt</span>
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              setHidePinyin(!hidePinyin);
            }}
            className={`flex items-center space-x-1 min-h-[36px] px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 touch-manipulation whitespace-nowrap text-xs font-medium ${
              hidePinyin
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 active:bg-slate-700'
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
            className={`flex items-center space-x-1 min-h-[36px] px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 touch-manipulation whitespace-nowrap text-xs font-medium ${
              hideHanviet
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 active:bg-slate-700'
            }`}
            title="Ẩn/Hiện Hán Việt"
          >
            {hideHanviet ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Hán Việt</span>
          </button>

          <button
            data-testid="toggle-autoplay-btn"
            onClick={() => {
              audioService.playClick();
              setIsAutoPlay(!isAutoPlay);
            }}
            className={`flex items-center space-x-1 min-h-[36px] px-2.5 py-1.5 rounded-xl border font-bold text-xs transition-all active:scale-95 touch-manipulation whitespace-nowrap ${
              isAutoPlay
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 active:bg-slate-700'
            }`}
            title={isAutoPlay ? 'Đang chạy rảnh tay. Bấm để dừng' : 'Bật chế độ tự động chạy thẻ rảnh tay'}
          >
            {isAutoPlay ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Dừng</span>
              </>
            ) : (
              <>
                <Headphones className="w-3.5 h-3.5 text-rose-400" />
                <span>Rảnh tay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar showing % cards mastered */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-emerald-500 to-rose-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${words.length > 0 ? Math.min(100, (deckMasteredCount / words.length) * 100) : 0}%` }}
        />
      </div>

      {/* Hands-free Audio Player Banner */}
      {isAutoPlay && currentWord && (
        <div
          data-testid="autoplay-active-banner"
          className="mb-3 p-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-850 to-slate-900 border border-emerald-500/40 flex items-center justify-between shadow-lg text-xs animate-in fade-in duration-200"
        >
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-300 flex items-center gap-1">
              <span>Đang nghe rảnh tay</span>
              <span className="text-slate-400 font-normal">
                ({safeIndex + 1}/{unmasteredWords.length})
              </span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                audioService.playClick();
                handlePrev();
              }}
              className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 active:scale-95"
              title="Từ trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                setAutoPlaySpeed(autoPlaySpeed === 'normal' ? 'slow' : 'normal');
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] border border-slate-700 font-medium active:scale-95"
              title="Đổi nhịp độ lật thẻ"
            >
              {autoPlaySpeed === 'normal' ? 'Vừa' : 'Chậm'}
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                handleNext();
              }}
              className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 active:scale-95"
              title="Từ sau"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                setIsAutoPlay(false);
              }}
              className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] border border-rose-500/30 font-semibold active:scale-95"
            >
              Dừng
            </button>
          </div>
        </div>
      )}

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
              {/* Mặt trước */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750/80 rounded-3xl p-6 flex flex-col justify-between shadow-2xl backface-hidden">
                {!isReverseMode ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-rose-400 border border-slate-700/80 tracking-wide">
                        {currentWord.level}
                      </span>
                      <button
                        onClick={(e) => handleSpeak(e, currentWord.hanzi)}
                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-800/80 hover:bg-slate-750 active:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 active:scale-90 touch-manipulation shadow-xs shrink-0"
                        title="Phát âm từ"
                      >
                        <Volume2 className="w-5 h-5 text-rose-400" />
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
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-rose-400 border border-slate-700/80 tracking-wide">
                        {currentWord.level}
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        Đảo mặt • Active Recall
                      </span>
                    </div>

                    {/* Central Meaning Display for Active Recall */}
                    <div className="flex flex-col items-center justify-center my-auto py-4 px-2 text-center">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">
                        Định nghĩa tiếng Việt
                      </span>
                      <p className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-snug drop-shadow-sm">
                        {currentWord.meaning}
                      </p>
                      <span className="inline-block mt-3 text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                        {currentWord.pos}
                      </span>
                      <div className="mt-5 p-2.5 rounded-xl bg-slate-900/60 border border-dashed border-slate-750 text-slate-400 text-xs">
                        💡 Thử đọc và viết Hán tự trước khi lật đáp án
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-center text-xs text-amber-300/90 font-medium pt-2">
                      <ChevronUp className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                      <span>Vuốt lên xem đáp án Hán tự</span>
                    </div>
                  </>
                )}
              </div>

              {/* Mặt sau */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750/80 rounded-3xl p-6 flex flex-col justify-between shadow-2xl backface-hidden rotate-x-180">
                {!isReverseMode ? (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-slate-100">{currentWord.hanzi}</span>
                        <span className="text-sm text-rose-400 font-medium pinyin-text">{currentWord.pinyin}</span>
                      </div>
                      <button
                        onClick={(e) => handleSpeak(e, currentWord.hanzi)}
                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-300 transition-all border border-slate-700 active:scale-90 touch-manipulation shadow-xs shrink-0"
                        title="Phát âm"
                      >
                        <Volume2 className="w-5 h-5 text-rose-400" />
                      </button>
                    </div>

                    {/* Meaning & Details */}
                    <div className="flex-1 flex flex-col justify-center my-2 space-y-2.5 overflow-y-auto pr-1">
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
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Đáp án chuẩn
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleSpeak(e, currentWord.hanzi)}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 transition-colors border border-slate-700 flex items-center gap-1 text-xs"
                        title="Phát âm Hán tự"
                      >
                        <Volume2 className="w-4 h-4 text-rose-400" />
                        <span>Phát âm</span>
                      </button>
                    </div>

                    {/* Hanzi, Pinyin & Details */}
                    <div className="flex-1 flex flex-col justify-center my-2 space-y-2.5 overflow-y-auto pr-1">
                      <div className="flex flex-col items-center text-center">
                        <span className="text-6xl sm:text-7xl font-bold text-slate-100 tracking-wider filter drop-shadow-md select-all">
                          {currentWord.hanzi}
                        </span>
                        <span className="text-xl sm:text-2xl font-semibold text-rose-400 pinyin-text tracking-wide mt-1">
                          {currentWord.pinyin}
                        </span>
                        {currentWord.hanviet && (
                          <span className="text-xs uppercase font-bold text-amber-300 tracking-widest px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 mt-1">
                            {currentWord.hanviet}
                          </span>
                        )}
                        <p className="text-sm font-medium text-slate-300 mt-2">
                          {currentWord.meaning} <span className="text-slate-500 text-xs">({currentWord.pos})</span>
                        </p>
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
                              <span>Nghe</span>
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
                      <span>Vuốt lên để lật lại</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: SRS Rating & Navigation */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => handleAnswer(false)}
              className="min-h-[50px] flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-750 active:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all font-bold text-sm shadow-md touch-manipulation"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Chưa nhớ</span>
            </button>

            <button
              onClick={() => handleAnswer(true)}
              className="min-h-[50px] flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-900/30 active:scale-95 transition-all touch-manipulation"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Đã thuộc</span>
            </button>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-between mt-3 text-slate-400">
            <button
              onClick={() => {
                audioService.playClick();
                handlePrev();
              }}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl hover:bg-slate-800 active:bg-slate-750 flex items-center text-xs font-semibold transition-all touch-manipulation active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Từ trước
            </button>
            <button
              onClick={() => {
                audioService.playClick();
                handleNext();
              }}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl hover:bg-slate-800 active:bg-slate-750 flex items-center text-xs font-semibold transition-all touch-manipulation active:scale-95"
            >
              Từ sau <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Swipe Gesture Hint */}
          <div className="text-center text-[11px] text-slate-500 mt-2.5 select-none">
            Mẹo: Vuốt lên để lật • Vuốt sang phải (Đã thuộc) • Vuốt sang trái (Chưa nhớ) • Phím S (Xáo) • Phím R (Đảo mặt)
          </div>

          {/* Floating Undo Pill */}
          {lastMasteredWord && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 max-w-xs w-[90%] flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-850/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
              <span className="text-slate-300 truncate mr-2">
                Đã thuộc: <span className="font-bold text-emerald-400">{lastMasteredWord.hanzi}</span> ({lastMasteredWord.pinyin})
              </span>
              <button
                onClick={handleUndoMastered}
                className="min-h-[36px] px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs shrink-0 flex items-center gap-1 transition-all active:scale-95 touch-manipulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Hoàn tác</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
