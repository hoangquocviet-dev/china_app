import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Clock,
  Flame,
  Puzzle,
  RotateCcw,
  Star,
  Trophy,
  Sparkles,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';

interface SpeedMatchGameProps {
  words: ChineseWord[];
  showPinyinHint: boolean;
  bestScore: number;
  onBack: () => void;
  onFinishGame: (score: number, wavesCleared: number, masteredWordIds: string[]) => void;
}

interface MatchCard {
  id: string;
  wordId: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  type: 'hanzi' | 'meaning';
  matched: boolean;
}

const PAIRS_PER_WAVE = 6; // 12 cards (3x4 grid)
const INITIAL_TIME_MS = 60000;
const WAVE_BONUS_MS = 4000;

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const SpeedMatchGame: React.FC<SpeedMatchGameProps> = ({
  words,
  showPinyinHint,
  bestScore,
  onBack,
  onFinishGame,
}) => {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [wave, setWave] = useState(1);
  const [wavesCleared, setWavesCleared] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [pairsMatched, setPairsMatched] = useState(0);
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [mismatchPair, setMismatchPair] = useState<string[]>([]);
  const [waveBanner, setWaveBanner] = useState<string | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const timerBarRef = useRef<HTMLDivElement | null>(null);
  const timerTextRef = useRef<HTMLSpanElement | null>(null);
  const lastTimerStrRef = useRef<string>('60.0s');
  const deadlineRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const mismatchTimeoutRef = useRef<number | null>(null);
  const waveTransitionTimeoutRef = useRef<number | null>(null);
  const lastWholeSecondRef = useRef<number>(60);
  const masteredSetRef = useRef<Set<string>>(new Set());
  const matchedCardIdsRef = useRef<Set<string>>(new Set());
  const selectedCardIdRef = useRef<string | null>(null);
  const cardsRef = useRef<MatchCard[]>([]);
  const comboRef = useRef<number>(0);
  const maxComboRef = useRef<number>(0);
  const waveLockedRef = useRef<boolean>(false);
  const waveNumRef = useRef<number>(1);
  const scoreRef = useRef<number>(0);
  const wavesClearedRef = useRef<number>(0);

  const clearAllTimers = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (mismatchTimeoutRef.current !== null) {
      window.clearTimeout(mismatchTimeoutRef.current);
      mismatchTimeoutRef.current = null;
    }
    if (waveTransitionTimeoutRef.current !== null) {
      window.clearTimeout(waveTransitionTimeoutRef.current);
      waveTransitionTimeoutRef.current = null;
    }
  }, []);

  const generateWaveCards = useCallback(
    (waveNumber: number): MatchCard[] => {
      const shuffledWords = shuffleArray(words);
      const chosen: ChineseWord[] = [];
      const usedMeanings = new Set<string>();
      const usedHanzis = new Set<string>();

      for (const w of shuffledWords) {
        const mKey = w.meaning.trim().toLowerCase();
        const hKey = w.hanzi.trim();
        if (!usedMeanings.has(mKey) && !usedHanzis.has(hKey)) {
          usedMeanings.add(mKey);
          usedHanzis.add(hKey);
          chosen.push(w);
        }
        if (chosen.length >= PAIRS_PER_WAVE) break;
      }

      const rawCards: MatchCard[] = [];
      chosen.forEach((w, idx) => {
        rawCards.push({
          id: `w${waveNumber}_${idx}_hanzi`,
          wordId: w.id,
          hanzi: w.hanzi,
          pinyin: w.pinyin,
          meaning: w.meaning,
          type: 'hanzi',
          matched: false,
        });
        rawCards.push({
          id: `w${waveNumber}_${idx}_meaning`,
          wordId: w.id,
          hanzi: w.hanzi,
          pinyin: w.pinyin,
          meaning: w.meaning,
          type: 'meaning',
          matched: false,
        });
      });

      return shuffleArray(rawCards);
    },
    [words]
  );

  const endSession = useCallback(() => {
    clearAllTimers();
    const finalScore = scoreRef.current;
    const finalWaves = wavesClearedRef.current;
    const beatRecord = finalScore > bestScore && finalScore > 0;
    setIsNewRecord(beatRecord);
    setPhase('gameover');
    onFinishGame(finalScore, finalWaves, Array.from(masteredSetRef.current));

    if (finalScore >= 300 || beatRecord) {
      audioService.playLevelUp();
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.6 },
      });
    } else {
      audioService.playGameOver();
    }
  }, [bestScore, clearAllTimers, onFinishGame]);

  const startClockLoop = useCallback(() => {
    const tick = (now: number) => {
      const remaining = Math.max(0, deadlineRef.current - now);
      const pct = Math.min(100, (remaining / INITIAL_TIME_MS) * 100);

      if (timerBarRef.current) {
        timerBarRef.current.style.width = `${pct}%`;
        if (remaining > 20000) {
          timerBarRef.current.style.backgroundColor = '#10b981';
        } else if (remaining > 8000) {
          timerBarRef.current.style.backgroundColor = '#f59e0b';
        } else {
          timerBarRef.current.style.backgroundColor = '#f43f5e';
        }
      }

      const wholeSec = Math.ceil(remaining / 1000);
      if (wholeSec !== lastWholeSecondRef.current) {
        lastWholeSecondRef.current = wholeSec;
        if (wholeSec <= 5 && wholeSec > 0) {
          audioService.playTick();
        }
      }

      const formatted = `${(remaining / 1000).toFixed(1)}s`;
      if (formatted !== lastTimerStrRef.current) {
        lastTimerStrRef.current = formatted;
        if (timerTextRef.current) {
          timerTextRef.current.textContent = formatted;
        }
      }

      if (remaining <= 0) {
        endSession();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [endSession]);

  const handleStartGame = () => {
    audioService.playClick();
    clearAllTimers();
    masteredSetRef.current = new Set();
    matchedCardIdsRef.current = new Set();
    selectedCardIdRef.current = null;
    comboRef.current = 0;
    maxComboRef.current = 0;
    waveLockedRef.current = false;
    waveNumRef.current = 1;
    scoreRef.current = 0;
    wavesClearedRef.current = 0;
    lastWholeSecondRef.current = 60;
    lastTimerStrRef.current = '60.0s';

    setIsNewRecord(false);
    setWave(1);
    setWavesCleared(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPairsMatched(0);
    setSelectedCardId(null);
    setMismatchPair([]);
    setWaveBanner(null);

    const firstCards = generateWaveCards(1);
    cardsRef.current = firstCards;
    setCards(firstCards);
    setPhase('playing');

    deadlineRef.current = performance.now() + INITIAL_TIME_MS;
    startClockLoop();
  };

  const handleCardClick = (clickedCard: MatchCard) => {
    if (
      phase !== 'playing' ||
      waveLockedRef.current ||
      clickedCard.matched ||
      matchedCardIdsRef.current.has(clickedCard.id)
    ) {
      return;
    }

    // Clear any active mismatch shake immediately for snappy response
    if (mismatchPair.length > 0) {
      if (mismatchTimeoutRef.current !== null) {
        window.clearTimeout(mismatchTimeoutRef.current);
        mismatchTimeoutRef.current = null;
      }
      setMismatchPair([]);
    }

    const activeSelectedId = selectedCardIdRef.current;

    if (!activeSelectedId) {
      selectedCardIdRef.current = clickedCard.id;
      setSelectedCardId(clickedCard.id);
      audioService.playClick();
      if (clickedCard.type === 'hanzi') {
        audioService.speakChinese(clickedCard.hanzi, 1.05);
      }
      return;
    }

    if (activeSelectedId === clickedCard.id) {
      selectedCardIdRef.current = null;
      setSelectedCardId(null);
      audioService.playClick();
      return;
    }

    const firstCard = cardsRef.current.find((c) => c.id === activeSelectedId);
    if (!firstCard || matchedCardIdsRef.current.has(firstCard.id)) {
      selectedCardIdRef.current = clickedCard.id;
      setSelectedCardId(clickedCard.id);
      return;
    }

    // If user tapped another card of the SAME type (e.g. Hanzi -> Hanzi), switch selection smoothly
    if (firstCard.type === clickedCard.type) {
      selectedCardIdRef.current = clickedCard.id;
      setSelectedCardId(clickedCard.id);
      audioService.playClick();
      if (clickedCard.type === 'hanzi') {
        audioService.speakChinese(clickedCard.hanzi, 1.05);
      }
      return;
    }

    // Opposite types: check match!
    if (firstCard.wordId === clickedCard.wordId) {
      // Synchronously lock both card IDs & clear selection to support instant two-thumb simultaneous taps!
      matchedCardIdsRef.current.add(firstCard.id);
      matchedCardIdsRef.current.add(clickedCard.id);
      selectedCardIdRef.current = null;
      setSelectedCardId(null);

      const nextCombo = comboRef.current + 1;
      const nextMaxCombo = Math.max(maxComboRef.current, nextCombo);
      comboRef.current = nextCombo;
      maxComboRef.current = nextMaxCombo;

      const multiplier = nextCombo >= 8 ? 3 : nextCombo >= 4 ? 2 : 1;
      const earned = 60 * multiplier;
      const updatedCards = cardsRef.current.map((c) =>
        c.id === firstCard.id || c.id === clickedCard.id || matchedCardIdsRef.current.has(c.id)
          ? { ...c, matched: true }
          : c
      );

      cardsRef.current = updatedCards;
      setCards(updatedCards);
      setCombo(nextCombo);
      setMaxCombo(nextMaxCombo);
      setPairsMatched((p) => p + 1);
      masteredSetRef.current.add(clickedCard.wordId);

      audioService.playMatchPop();
      audioService.playComboChime(nextCombo);
      audioService.speakChinese(clickedCard.hanzi, 1.05);
      try {
        navigator.vibrate?.(18);
      } catch {}

      const allCleared = updatedCards.every((c) => c.matched);
      if (allCleared) {
        waveLockedRef.current = true;
        try {
          navigator.vibrate?.([20, 30, 40]);
        } catch {}
        const waveBonus = 150;
        const nextTotalScore = scoreRef.current + earned + waveBonus;
        scoreRef.current = nextTotalScore;
        setScore(nextTotalScore);

        const nextWavesCleared = wavesClearedRef.current + 1;
        wavesClearedRef.current = nextWavesCleared;
        setWavesCleared(nextWavesCleared);

        // Add +4.0s bonus time (capped at 60s)
        const now = performance.now();
        deadlineRef.current = Math.min(now + INITIAL_TIME_MS, deadlineRef.current + WAVE_BONUS_MS);

        const currentWaveNum = waveNumRef.current;
        setWaveBanner(`Sạch Bàn #${currentWaveNum}! +150đ & +4 giây ⏱️`);
        audioService.playLevelUp();

        waveTransitionTimeoutRef.current = window.setTimeout(() => {
          const nextWaveNum = currentWaveNum + 1;
          waveNumRef.current = nextWaveNum;
          matchedCardIdsRef.current = new Set();
          selectedCardIdRef.current = null;
          waveLockedRef.current = false;
          const nextCards = generateWaveCards(nextWaveNum);
          cardsRef.current = nextCards;
          setWave(nextWaveNum);
          setCards(nextCards);
          setWaveBanner(null);
        }, 480);
      } else {
        const nextTotalScore = scoreRef.current + earned;
        scoreRef.current = nextTotalScore;
        setScore(nextTotalScore);
      }
    } else {
      // Mismatch!
      selectedCardIdRef.current = null;
      comboRef.current = 0;
      setSelectedCardId(null);
      setCombo(0);
      setMismatchPair([firstCard.id, clickedCard.id]);
      audioService.playErrorBuzz();
      try {
        navigator.vibrate?.([30, 40, 30]);
      } catch {}

      mismatchTimeoutRef.current = window.setTimeout(() => {
        setMismatchPair([]);
      }, 360);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (document.querySelector('.fixed.inset-0')) return;
      if ((phase === 'ready' || phase === 'gameover') && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleStartGame();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase]);

  useEffect(() => {
    return () => {
      clearAllTimers();
      audioService.stopSpeech();
    };
  }, [clearAllTimers]);

  const starsEarned = score >= 1200 ? 3 : score >= 650 ? 2 : score >= 250 ? 1 : 0;

  return (
    <div className="flex-1 max-w-md mx-auto w-full p-4 pb-24 flex flex-col select-none animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            audioService.playClick();
            clearAllTimers();
            audioService.stopSpeech();
            onBack();
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sảnh game</span>
        </button>

        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Kỷ lục: {Math.max(bestScore, score)}</span>
        </div>
      </div>

      {/* READY SCREEN */}
      {phase === 'ready' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-800/60 border border-slate-750 rounded-3xl p-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-900/40 mb-4">
            <Puzzle className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 mb-1.5">
            Ghép Thẻ Tốc Độ 60 Giây
          </h2>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-5">
            Chạm chọn cặp thẻ <span className="text-rose-400 font-semibold">Chữ Hán</span> và{' '}
            <span className="text-amber-300 font-semibold">Nghĩa tiếng Việt</span> tương ứng để phá
            bàn! Dọn sạch mỗi bàn được thưởng thêm <span className="text-emerald-400 font-bold">+4 giây</span>!
          </p>

          <div className="grid grid-cols-3 gap-2 w-full mb-6 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-850/90 border border-slate-700/70">
              <div className="text-emerald-400 font-bold">60 Giây</div>
              <div className="text-[10px] text-slate-400 mt-0.5">+4s mỗi bàn sạch</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-850/90 border border-slate-700/70">
              <div className="text-amber-400 font-bold">12 Ô Thẻ</div>
              <div className="text-[10px] text-slate-400 mt-0.5">6 cặp từ mỗi màn</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-850/90 border border-slate-700/70">
              <div className="text-rose-400 font-bold">Đạt 3 Sao</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Mốc 1.200+ điểm</div>
            </div>
          </div>

          <button
            data-testid="match-start-btn"
            onClick={handleStartGame}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-950/50 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>BẮT ĐẦU ĐẾM NGƯỢC 60S</span>
          </button>
        </div>
      )}

      {/* PLAYING SCREEN */}
      {phase === 'playing' && (
        <div className="flex-1 flex flex-col space-y-2.5">
          {/* HUD */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-800/90 border border-slate-750 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-slate-200">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span
                ref={timerTextRef}
                className="tabular-nums text-sm font-extrabold text-white"
              >
                60.0s
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold text-[11px]">
                Bàn #{wave}
              </span>
              {combo >= 2 && (
                <span className="inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 font-extrabold text-[11px]">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>x{combo}</span>
                </span>
              )}
            </div>

            <div className="font-black text-sm text-amber-300 tabular-nums">{score} đ</div>
          </div>

          {/* Timer Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/80 p-0.5">
            <div
              ref={timerBarRef}
              className="w-full h-full rounded-full bg-emerald-500 transition-none"
            />
          </div>

          {/* Wave Clear Floating Toast */}
          {waveBanner && (
            <div className="py-1.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold text-center animate-fadeIn">
              {waveBanner}
            </div>
          )}

          {/* 3x4 Speed Match Grid */}
          <div
            data-testid="match-grid"
            className="flex-1 grid grid-cols-3 grid-rows-4 gap-2 min-h-[340px]"
          >
            {cards.map((card) => {
              const isSelected = selectedCardId === card.id;
              const isMismatch = mismatchPair.includes(card.id);

              if (card.matched) {
                return (
                  <div
                    key={card.id}
                    data-testid="match-card"
                    data-word-id={card.wordId}
                    data-card-type={card.type}
                    data-matched="true"
                    className="rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center text-emerald-500/50 scale-95 transition-all duration-200"
                  >
                    <Check className="w-5 h-5" />
                  </div>
                );
              }

              return (
                <button
                  key={card.id}
                  type="button"
                  data-testid="match-card"
                  data-word-id={card.wordId}
                  data-card-type={card.type}
                  data-matched="false"
                  onClick={() => handleCardClick(card)}
                  className={`relative p-2 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all active:scale-95 overflow-hidden ${
                    isMismatch
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200 scale-95'
                      : isSelected
                      ? 'bg-rose-600/25 border-rose-400 text-white shadow-md shadow-rose-900/40 scale-[1.03]'
                      : card.type === 'hanzi'
                      ? 'bg-slate-800/95 hover:bg-slate-800 border-slate-700 text-slate-100 shadow-sm'
                      : 'bg-slate-850/95 hover:bg-slate-800 border-indigo-500/25 text-amber-200 shadow-sm'
                  }`}
                >
                  {card.type === 'hanzi' ? (
                    <>
                      <span
                        className={`font-bold text-white leading-tight ${
                          card.hanzi.length >= 4
                            ? 'text-base'
                            : card.hanzi.length === 3
                            ? 'text-lg'
                            : 'text-2xl'
                        }`}
                      >
                        {card.hanzi}
                      </span>
                      {showPinyinHint && (
                        <span className="text-[10px] text-rose-300/90 pinyin-text mt-1 leading-normal py-0.5 truncate max-w-full">
                          {card.pinyin}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[11px] sm:text-xs font-semibold leading-snug line-clamp-3 text-slate-200">
                      {card.meaning}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {phase === 'gameover' && (
        <div
          data-testid="match-gameover"
          className="flex-1 flex flex-col items-center justify-center bg-slate-800/70 border border-slate-750 rounded-3xl p-6 shadow-xl text-center space-y-4 animate-fadeIn"
        >
          {/* 3 Stars Display */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-10 h-10 transition-all ${
                  starIdx <= starsEarned
                    ? 'text-amber-400 fill-amber-400 drop-shadow-md scale-110'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">Hết 60 Giây Tốc Độ!</h2>
            <p className="text-3xl font-black text-amber-400 mt-1 tabular-nums">{score} điểm</p>
            {isNewRecord && (
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-extrabold text-amber-300">
                🎉 KỶ LỤC MỚI!
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 w-full text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-750">
              <div className="text-slate-400 text-[10px]">Cặp Đã Ghép</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">{pairsMatched}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-750">
              <div className="text-slate-400 text-[10px]">Bàn Phá Đảo</div>
              <div className="text-base font-bold text-indigo-400 mt-0.5">{wavesCleared}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-750">
              <div className="text-slate-400 text-[10px]">Combo Đỉnh</div>
              <div className="text-base font-bold text-amber-400 mt-0.5">x{maxCombo}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 w-full pt-2">
            <button
              type="button"
              onClick={() => {
                audioService.playClick();
                onBack();
              }}
              className="py-3 rounded-2xl bg-slate-750 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-600/60 transition-all active:scale-95"
            >
              Đổi trò chơi
            </button>
            <button
              type="button"
              onClick={handleStartGame}
              className="py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-900/30 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi lại 60s</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
