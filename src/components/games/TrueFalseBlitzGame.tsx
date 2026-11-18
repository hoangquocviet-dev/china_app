import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Flame,
  Heart,
  Check,
  X,
  RotateCcw,
  Trophy,
  Volume2,
  Zap,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';

interface TrueFalseBlitzGameProps {
  words: ChineseWord[];
  showPinyinHint: boolean;
  bestScore: number;
  onBack: () => void;
  onFinishGame: (score: number, maxCombo: number, masteredWordIds: string[]) => void;
}

interface BlitzQuestion {
  word: ChineseWord;
  displayedMeaning: string;
  displayedPinyin?: string;
  isMatch: boolean;
  durationMs: number;
}

export const TrueFalseBlitzGame: React.FC<TrueFalseBlitzGameProps> = ({
  words,
  showPinyinHint,
  bestScore,
  onBack,
  onFinishGame,
}) => {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [question, setQuestion] = useState<BlitzQuestion | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | 'timeout';
    points?: number;
    trueMeaning?: string;
  } | null>(null);
  const [missedWords, setMissedWords] = useState<ChineseWord[]>([]);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const timerTextRef = useRef<HTMLSpanElement | null>(null);
  const lastTimerStrRef = useRef<string>('2.4s');
  const rafRef = useRef<number | null>(null);
  const deadlineRef = useRef<number>(0);
  const durationRef = useRef<number>(2000);
  const lockedRef = useRef<boolean>(false);
  const lastWordIdRef = useRef<string | null>(null);
  const masteredSetRef = useRef<Set<string>>(new Set());
  const nextTimerRef = useRef<number | null>(null);

  // Touch swipe refs
  const touchStartXRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (nextTimerRef.current !== null) {
      window.clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }
  }, []);

  const buildQuestion = useCallback(
    (nextRound: number, currentCombo: number): BlitzQuestion => {
      const pool = words.length > 0 ? words : [];
      let candidates = pool.filter((w) => w.id !== lastWordIdRef.current);
      if (candidates.length === 0) candidates = pool;

      const targetWord = candidates[Math.floor(Math.random() * candidates.length)];
      lastWordIdRef.current = targetWord.id;

      const distractorPool = pool.filter(
        (w) =>
          w.id !== targetWord.id &&
          w.meaning.trim().toLowerCase() !== targetWord.meaning.trim().toLowerCase()
      );

      const isMatch = distractorPool.length === 0 ? true : Math.random() < 0.5;
      const distractor =
        !isMatch && distractorPool.length > 0
          ? distractorPool[Math.floor(Math.random() * distractorPool.length)]
          : targetWord;

      // Adaptive blitz timer: 2.4s warm-up -> 2.0s standard -> 1.75s fever
      let durationMs = 2000;
      if (nextRound <= 3) durationMs = 2400;
      else if (currentCombo >= 10) durationMs = 1750;

      return {
        word: targetWord,
        displayedMeaning: isMatch ? targetWord.meaning : distractor.meaning,
        isMatch,
        durationMs,
      };
    },
    [words]
  );

  const finishSession = useCallback(
    (finalScore: number, finalMaxCombo: number) => {
      clearTimers();
      const beatRecord = finalScore > bestScore && finalScore > 0;
      setIsNewRecord(beatRecord);
      setPhase('gameover');
      onFinishGame(finalScore, finalMaxCombo, Array.from(masteredSetRef.current));

      if (beatRecord) {
        audioService.playLevelUp();
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        audioService.playGameOver();
      }
    },
    [bestScore, clearTimers, onFinishGame]
  );

  const startNextQuestion = useCallback(
    (
      nextRound: number,
      currentCombo: number,
      currentLives: number,
      currentScore: number,
      currentMaxCombo: number
    ) => {
      if (currentLives <= 0) {
        finishSession(currentScore, currentMaxCombo);
        return;
      }

      const nextQ = buildQuestion(nextRound, currentCombo);
      setQuestion(nextQ);
      setFeedback(null);
      setRoundCount(nextRound);
      lockedRef.current = false;

      durationRef.current = nextQ.durationMs;
      deadlineRef.current = performance.now() + nextQ.durationMs;

      if (progressBarRef.current) {
        progressBarRef.current.style.width = '100%';
        progressBarRef.current.style.backgroundColor = '#10b981';
      }
      const initStr = `${(nextQ.durationMs / 1000).toFixed(1)}s`;
      lastTimerStrRef.current = initStr;
      if (timerTextRef.current) {
        timerTextRef.current.textContent = initStr;
      }

      const tick = (now: number) => {
        if (lockedRef.current) return;
        const remaining = Math.max(0, deadlineRef.current - now);
        const pct = (remaining / durationRef.current) * 100;

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${pct}%`;
          if (pct > 50) {
            progressBarRef.current.style.backgroundColor = '#10b981';
          } else if (pct > 25) {
            progressBarRef.current.style.backgroundColor = '#f59e0b';
          } else {
            progressBarRef.current.style.backgroundColor = '#f43f5e';
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
          // Timeout!
          lockedRef.current = true;
          const nextLives = currentLives - 1;
          setLives(nextLives);
          setCombo(0);
          setMissedWords((prev) =>
            prev.some((w) => w.id === nextQ.word.id) ? prev : [nextQ.word, ...prev].slice(0, 8)
          );
          setFeedback({
            type: 'timeout',
            trueMeaning: `${nextQ.word.hanzi} (${nextQ.word.pinyin}): ${nextQ.word.meaning}`,
          });
          audioService.playErrorBuzz();

          nextTimerRef.current = window.setTimeout(() => {
            startNextQuestion(nextRound + 1, 0, nextLives, currentScore, currentMaxCombo);
          }, 950);
          return;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    },
    [buildQuestion, finishSession]
  );

  const handleStartGame = () => {
    audioService.playClick();
    clearTimers();
    masteredSetRef.current = new Set();
    setIsNewRecord(false);
    setLives(3);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setRoundCount(0);
    setCorrectCount(0);
    setMissedWords([]);
    setPhase('playing');
    startNextQuestion(1, 0, 3, 0, 0);
  };

  const handleAnswer = useCallback(
    (userSaysTrue: boolean) => {
      if (phase !== 'playing' || !question || lockedRef.current) return;
      lockedRef.current = true;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      const isCorrect = userSaysTrue === question.isMatch;
      const remainingRatio = Math.max(
        0,
        (deadlineRef.current - performance.now()) / durationRef.current
      );

      if (isCorrect) {
        const nextCombo = combo + 1;
        const nextMaxCombo = Math.max(maxCombo, nextCombo);
        const multiplier = nextCombo >= 10 ? 3 : nextCombo >= 5 ? 2 : 1;
        const speedBonus = Math.round(remainingRatio * 25);
        const pointsEarned = (50 + speedBonus) * multiplier;
        const nextScore = score + pointsEarned;

        setCombo(nextCombo);
        setMaxCombo(nextMaxCombo);
        setScore(nextScore);
        setCorrectCount((c) => c + 1);
        masteredSetRef.current.add(question.word.id);

        setFeedback({ type: 'correct', points: pointsEarned });
        audioService.playComboChime(nextCombo);
        audioService.speakChinese(question.word.hanzi, 1.05);
        try {
          if (nextCombo >= 10) {
            navigator.vibrate?.([20, 30, 20, 30, 30]);
          } else if (nextCombo >= 5) {
            navigator.vibrate?.([15, 30, 15]);
          } else {
            navigator.vibrate?.(15);
          }
        } catch {}

        nextTimerRef.current = window.setTimeout(() => {
          startNextQuestion(roundCount + 1, nextCombo, lives, nextScore, nextMaxCombo);
        }, 320);
      } else {
        const nextLives = lives - 1;
        setLives(nextLives);
        setCombo(0);
        setMissedWords((prev) =>
          prev.some((w) => w.id === question.word.id) ? prev : [question.word, ...prev].slice(0, 8)
        );
        setFeedback({
          type: 'wrong',
          trueMeaning: `${question.word.hanzi} (${question.word.pinyin}): ${question.word.meaning}`,
        });
        audioService.playErrorBuzz();
        audioService.speakChinese(question.word.hanzi, 0.95);
        try {
          navigator.vibrate?.([40, 30, 40]);
        } catch {}

        nextTimerRef.current = window.setTimeout(() => {
          startNextQuestion(roundCount + 1, 0, nextLives, score, maxCombo);
        }, 950);
      }
    },
    [combo, lives, maxCombo, phase, question, roundCount, score, startNextQuestion]
  );

  // Keyboard shortcuts: Left / A = SAI, Right / D = ĐÚNG, Space / Enter = Start / Replay
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (document.querySelector('.fixed.inset-0')) return;
      if ((phase === 'ready' || phase === 'gameover') && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleStartGame();
        return;
      }
      if (phase !== 'playing') return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        handleAnswer(false);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        handleAnswer(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleAnswer, phase]);

  useEffect(() => {
    return () => {
      clearTimers();
      audioService.stopSpeech();
    };
  }, [clearTimers]);

  const isFever = combo >= 5;
  const accuracy = roundCount > 0 ? Math.round((correctCount / roundCount) * 100) : 0;

  return (
    <div className="flex-1 max-w-md mx-auto w-full p-4 pb-24 flex flex-col select-none animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            audioService.playClick();
            clearTimers();
            audioService.stopSpeech();
            onBack();
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sảnh game</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Kỷ lục: {Math.max(bestScore, score)}</span>
          </div>
        </div>
      </div>

      {/* READY SCREEN */}
      {phase === 'ready' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-800/60 border border-slate-750 rounded-3xl p-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-900/40 mb-4">
            <Zap className="w-9 h-9 text-white fill-white" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 mb-1.5">
            Chớp Nhoáng 2 Giây
          </h2>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-5">
            Một cặp <span className="text-rose-400 font-semibold">Chữ Hán</span> &{' '}
            <span className="text-emerald-400 font-semibold">Nghĩa tiếng Việt</span> sẽ xuất hiện.
            Bạn chỉ có <span className="text-amber-300 font-bold">2.0 giây</span> để quyết định{' '}
            <span className="text-emerald-400 font-bold">ĐÚNG</span> hay{' '}
            <span className="text-rose-400 font-bold">SAI</span>!
          </p>

          <div className="grid grid-cols-3 gap-2 w-full mb-6 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-850/90 border border-slate-700/70">
              <div className="text-rose-400 font-bold">3 Mạng</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Sai/Hết giờ -1</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-850/90 border border-slate-700/70">
              <div className="text-amber-400 font-bold">Combo x2/x3</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Liên tiếp 5+ câu</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-850/90 border border-slate-700/70">
              <div className="text-emerald-400 font-bold">{words.length} Từ</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Kho từ đang nạp</div>
            </div>
          </div>

          <button
            data-testid="blitz-start-btn"
            onClick={handleStartGame}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-lg shadow-rose-900/40 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>BẮT ĐẦU PHẢN XẠ NGAY</span>
          </button>
        </div>
      )}

      {/* PLAYING SCREEN */}
      {phase === 'playing' && question && (
        <div className="flex-1 flex flex-col justify-between space-y-3">
          {/* Status HUD: Hearts, Combo, Score */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-750">
            <div className="flex items-center space-x-1" aria-label={`Còn ${lives} mạng`}>
              {[1, 2, 3].map((idx) => (
                <Heart
                  key={idx}
                  className={`w-5 h-5 transition-all duration-300 ${
                    idx <= lives
                      ? 'text-rose-500 fill-rose-500 scale-100'
                      : 'text-slate-700 scale-75'
                  }`}
                />
              ))}
            </div>

            <div
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold transition-all ${
                isFever
                  ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/25 text-amber-300 border border-amber-400/40 scale-105'
                  : combo > 0
                  ? 'bg-slate-700/70 text-emerald-300'
                  : 'bg-slate-850 text-slate-500'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${isFever ? 'text-amber-400 animate-pulse' : ''}`} />
              <span>
                Combo x{combo} {combo >= 10 ? '(x3!)' : isFever ? '(x2!)' : ''}
              </span>
            </div>

            <div className="text-right">
              <div className="text-sm font-black text-slate-100 tabular-nums">{score} đ</div>
            </div>
          </div>

          {/* 2.0s Countdown Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold px-1">
              <span className="text-slate-400">Câu #{roundCount}</span>
              <span ref={timerTextRef} className="text-amber-300 tabular-nums">
                2.4s
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700/80 p-0.5">
              <div
                ref={progressBarRef}
                className="w-full h-full rounded-full bg-emerald-500 transition-none"
              />
            </div>
          </div>

          {/* Flash Question Card */}
          <div
            data-testid="blitz-card"
            data-is-match={question.isMatch ? 'true' : 'false'}
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartXRef.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartXRef.current;
              touchStartXRef.current = null;
              if (dx < -45) handleAnswer(false);
              else if (dx > 45) handleAnswer(true);
            }}
            className={`relative flex-1 flex flex-col items-center justify-center rounded-3xl p-5 border-2 transition-all overflow-hidden ${
              feedback?.type === 'correct'
                ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-900/30'
                : feedback?.type === 'wrong' || feedback?.type === 'timeout'
                ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-900/30'
                : isFever
                ? 'bg-slate-800/90 border-amber-500/60 shadow-lg shadow-amber-900/20'
                : 'bg-slate-800/85 border-slate-700 shadow-xl'
            }`}
          >
            {isFever && !feedback && (
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-[10px] font-bold text-amber-300">
                <Sparkles className="w-3 h-3" /> FEVER
              </div>
            )}

            {/* Hanzi Prompt */}
            <div className="text-center mb-4">
              <div className="text-5xl sm:text-6xl font-bold text-white tracking-wide mb-2">
                {question.word.hanzi}
              </div>
              {showPinyinHint && (
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700">
                  <span className="text-sm font-semibold text-rose-400 pinyin-text">
                    {question.word.pinyin}
                  </span>
                  {question.word.hanviet && (
                    <span className="text-[10px] font-bold text-amber-300 uppercase">
                      • {question.word.hanviet}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Equals / Paired Meaning Box */}
            <div className="w-full max-w-xs rounded-2xl bg-slate-900/90 border border-slate-700/90 p-3.5 text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Có nghĩa là:
              </div>
              <div className="text-lg font-extrabold text-amber-300 leading-snug">
                “{question.displayedMeaning}”
              </div>
            </div>

            {/* Instant Feedback Banner */}
            {feedback && (
              <div
                className={`mt-3 px-3.5 py-2 rounded-xl text-xs font-bold text-center w-full animate-fadeIn ${
                  feedback.type === 'correct'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                }`}
              >
                {feedback.type === 'correct' && <span>Chính xác! +{feedback.points} điểm ⚡</span>}
                {feedback.type === 'wrong' && <span>Sai rồi! {feedback.trueMeaning}</span>}
                {feedback.type === 'timeout' && <span>Hết 2 giây! {feedback.trueMeaning}</span>}
              </div>
            )}
          </div>

          {/* Giant Thumb Controls: SAI vs ĐÚNG */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              data-testid="blitz-btn-false"
              onClick={() => handleAnswer(false)}
              className="py-4 rounded-2xl bg-rose-600/90 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-base flex items-center justify-center space-x-2 shadow-lg shadow-rose-950/50 border border-rose-400/30 transition-all"
            >
              <X className="w-6 h-6 stroke-[3]" />
              <span>SAI</span>
            </button>

            <button
              type="button"
              data-testid="blitz-btn-true"
              onClick={() => handleAnswer(true)}
              className="py-4 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-base flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-all"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>ĐÚNG</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {phase === 'gameover' && (
        <div
          data-testid="blitz-gameover"
          className="flex-1 flex flex-col bg-slate-800/70 border border-slate-750 rounded-3xl p-5 shadow-xl space-y-4 animate-fadeIn"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 mb-2">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Kết Thúc Lượt Phản Xạ!</h2>
            <p className="text-3xl font-black text-amber-400 mt-1 tabular-nums">{score} điểm</p>
            {isNewRecord && (
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-extrabold text-amber-300">
                🎉 KỶ LỤC MỚI!
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-750">
              <div className="text-slate-400 text-[10px]">Đúng</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                {correctCount}/{roundCount}
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-750">
              <div className="text-slate-400 text-[10px]">Combo Đỉnh</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">x{maxCombo}</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-750">
              <div className="text-slate-400 text-[10px]">Chính xác</div>
              <div className="text-sm font-bold text-rose-400 mt-0.5">{accuracy}%</div>
            </div>
          </div>

          {/* Review Missed Words */}
          {missedWords.length > 0 && (
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="text-xs font-bold text-slate-300 mb-2">
                Ôn nhanh từ vừa nhầm ({missedWords.length}):
              </div>
              <div className="space-y-1.5 overflow-y-auto max-h-44 pr-1">
                {missedWords.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-750 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-white text-sm mr-2">{w.hanzi}</span>
                      <span className="text-rose-400 pinyin-text mr-2">{w.pinyin}</span>
                      <span className="text-slate-300">{w.meaning}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => audioService.speakChinese(w.hanzi)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 pt-2 mt-auto">
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
              className="py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-rose-900/30 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi lại ngay</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
