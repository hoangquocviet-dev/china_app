import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Flame,
  Heart,
  RotateCcw,
  Trophy,
  Volume2,
  Zap,
  Rocket,
  Gauge,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';

interface WordRunnerGameProps {
  words: ChineseWord[];
  showPinyinHint: boolean;
  bestScore: number;
  bestDistance: number;
  onBack: () => void;
  onFinishGame: (
    score: number,
    distanceMeters: number,
    masteredWordIds: string[]
  ) => void;
}

interface GateWave {
  word: ChineseWord;
  mode: 'hanzi_to_vi' | 'vi_to_hanzi';
  promptMain: string;
  promptSub?: string;
  options: [string, string, string];
  correctLane: 0 | 1 | 2;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Universal rounded-rect canvas helper (supports iOS Safari < 16 where ctx.roundRect is absent)
function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export const WordRunnerGame: React.FC<WordRunnerGameProps> = ({
  words,
  showPinyinHint,
  bestScore,
  bestDistance,
  onBack,
  onFinishGame,
}) => {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [playerLane, setPlayerLane] = useState<0 | 1 | 2>(1);
  const [currentWave, setCurrentWave] = useState<GateWave | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{
    type: 'correct' | 'wrong' | 'levelup';
    text: string;
  } | null>(null);
  const [missedWords, setMissedWords] = useState<ChineseWord[]>([]);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Mutable simulation refs for 60fps canvas loop without React re-render overhead
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const distanceTextRef = useRef<HTMLSpanElement | null>(null);
  const lastDisplayedMetersRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);

  const playerLaneRef = useRef<0 | 1 | 2>(1);
  const playerVisualXRef = useRef<number>(0.5); // normalized 0..1 across track
  const gateProgressRef = useRef<number>(0); // 0 (horizon) -> 1 (player collision line)
  const isTurboRef = useRef<boolean>(false);
  const roadScrollRef = useRef<number>(0);
  const shakeIntensityRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const waveRef = useRef<GateWave | null>(null);
  const resolvingRef = useRef<boolean>(false);

  const livesRef = useRef<number>(3);
  const scoreRef = useRef<number>(0);
  const distanceRef = useRef<number>(0); // float accumulator so 60Hz/120Hz never truncates to 0
  const levelRef = useRef<number>(1);
  const comboRef = useRef<number>(0);
  const maxComboRef = useRef<number>(0);
  const gatesClearedRef = useRef<number>(0);
  const lastWordIdRef = useRef<string | null>(null);
  const masteredSetRef = useRef<Set<string>>(new Set());
  const toastTimerRef = useRef<number | null>(null);
  const gameOverTimerRef = useRef<number | null>(null);

  // Touch swipe tracking on canvas
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    if (gameOverTimerRef.current !== null) {
      window.clearTimeout(gameOverTimerRef.current);
      gameOverTimerRef.current = null;
    }
  }, []);

  const showQuickToast = useCallback(
    (type: 'correct' | 'wrong' | 'levelup', text: string, duration = 900) => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
      setFeedbackToast({ type, text });
      toastTimerRef.current = window.setTimeout(() => {
        setFeedbackToast(null);
      }, duration);
    },
    []
  );

  const buildNextWave = useCallback((): GateWave => {
    let candidates = words.filter((w) => w.id !== lastWordIdRef.current);
    if (candidates.length === 0) candidates = words;
    const target = candidates[Math.floor(Math.random() * candidates.length)];
    lastWordIdRef.current = target.id;

    const mode: 'hanzi_to_vi' | 'vi_to_hanzi' =
      Math.random() < 0.6 ? 'hanzi_to_vi' : 'vi_to_hanzi';

    const distractorCandidates = shuffle(
      words.filter(
        (w) =>
          w.id !== target.id &&
          w.hanzi.trim() !== target.hanzi.trim() &&
          w.meaning.trim().toLowerCase() !== target.meaning.trim().toLowerCase()
      )
    );

    const d1 = distractorCandidates[0] || target;
    const d2 = distractorCandidates[1] || d1;

    const correctLane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
    const wrongOptions =
      mode === 'hanzi_to_vi' ? [d1.meaning, d2.meaning] : [d1.hanzi, d2.hanzi];
    const rightOption = mode === 'hanzi_to_vi' ? target.meaning : target.hanzi;

    const options: [string, string, string] = ['', '', ''];
    let wIdx = 0;
    for (let lane = 0; lane < 3; lane++) {
      if (lane === correctLane) {
        options[lane] = rightOption;
      } else {
        options[lane] = wrongOptions[wIdx++] || '—';
      }
    }

    const promptMain = mode === 'hanzi_to_vi' ? target.hanzi : target.meaning;
    const promptSub =
      mode === 'hanzi_to_vi'
        ? showPinyinHint
          ? `${target.pinyin}${target.hanviet ? ` • ${target.hanviet}` : ''}`
          : undefined
        : showPinyinHint
        ? `Gợi ý Pinyin: ${target.pinyin}`
        : 'Chọn đúng cổng Chữ Hán';

    return {
      word: target,
      mode,
      promptMain,
      promptSub,
      options,
      correctLane,
    };
  }, [showPinyinHint, words]);

  const spawnExplosion = (normX: number, normY: number, isSuccess: boolean) => {
    const colors = isSuccess
      ? ['#10b981', '#34d399', '#fbbf24', '#38bdf8']
      : ['#f43f5e', '#fb7185', '#f97316'];
    const count = isSuccess ? 24 : 18;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 70 + Math.random() * 140;
      particlesRef.current.push({
        x: normX,
        y: normY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.25,
        color: colors[i % colors.length],
        size: 3 + Math.random() * 3.5,
      });
    }
  };

  const triggerGameOver = useCallback(() => {
    stopLoop();
    const finalScore = scoreRef.current;
    const finalDist = Math.round(distanceRef.current);
    const beatRecord =
      (finalScore > bestScore && finalScore > 0) ||
      (finalDist > bestDistance && finalDist > 0);
    setDistance(finalDist);
    setIsNewRecord(beatRecord);
    setPhase('gameover');
    onFinishGame(finalScore, finalDist, Array.from(masteredSetRef.current));

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
  }, [bestDistance, bestScore, onFinishGame, stopLoop]);

  const resolveGateCollision = useCallback(() => {
    const activeWave = waveRef.current;
    if (!activeWave || resolvingRef.current) return;
    resolvingRef.current = true;

    const chosenLane = playerLaneRef.current;
    const laneCenterNorm = (chosenLane + 0.5) / 3;
    const isCorrect = chosenLane === activeWave.correctLane;
    const usedTurbo = isTurboRef.current;
    isTurboRef.current = false;

    if (isCorrect) {
      const nextCombo = comboRef.current + 1;
      const nextMax = Math.max(maxComboRef.current, nextCombo);
      comboRef.current = nextCombo;
      maxComboRef.current = nextMax;
      setCombo(nextCombo);
      setMaxCombo(nextMax);

      const multiplier = nextCombo >= 10 ? 3 : nextCombo >= 5 ? 2 : 1;
      const turboBonus = usedTurbo ? 35 : 0;
      const earned = (100 + turboBonus) * multiplier;

      gatesClearedRef.current += 1;
      const leveledUp = gatesClearedRef.current % 5 === 0;
      const levelBonus = leveledUp ? 200 : 0;

      const nextScore = scoreRef.current + earned + levelBonus;
      const nextDist = distanceRef.current + 50;
      scoreRef.current = nextScore;
      distanceRef.current = nextDist;
      const roundedDist = Math.round(nextDist);
      lastDisplayedMetersRef.current = roundedDist;
      if (distanceTextRef.current) {
        distanceTextRef.current.textContent = `${roundedDist}m`;
      }
      setScore(nextScore);
      setDistance(roundedDist);
      masteredSetRef.current.add(activeWave.word.id);

      spawnExplosion(laneCenterNorm, 0.78, true);
      audioService.playComboChime(nextCombo);
      audioService.speakChinese(activeWave.word.hanzi, 1.05);
      try {
        navigator.vibrate?.(25);
      } catch {}

      if (leveledUp) {
        const nextLv = levelRef.current + 1;
        levelRef.current = nextLv;
        setLevel(nextLv);
        audioService.playLevelUp();
        showQuickToast('levelup', `Lên Cấp Tốc Độ Lv.${nextLv}! +200đ 🚀`, 1100);
      } else {
        showQuickToast(
          'correct',
          `Vượt cổng chuẩn! +${earned}đ${usedTurbo ? ' (Turbo ⚡)' : ''}`,
          650
        );
      }

      // Spawn next gate immediately
      const nextW = buildNextWave();
      waveRef.current = nextW;
      setCurrentWave(nextW);
      gateProgressRef.current = 0;
      resolvingRef.current = false;
    } else {
      // Wrong lane collision
      const nextLives = livesRef.current - 1;
      livesRef.current = nextLives;
      comboRef.current = 0;
      setLives(nextLives);
      setCombo(0);
      shakeIntensityRef.current = 10;

      setMissedWords((prev) =>
        prev.some((w) => w.id === activeWave.word.id)
          ? prev
          : [activeWave.word, ...prev].slice(0, 8)
      );

      spawnExplosion(laneCenterNorm, 0.78, false);
      audioService.playErrorBuzz();
      audioService.speakChinese(activeWave.word.hanzi, 0.95);
      try {
        navigator.vibrate?.([40, 50, 40]);
      } catch {}
      showQuickToast(
        'wrong',
        `Va cổng! ${activeWave.word.hanzi} (${activeWave.word.pinyin}) = ${activeWave.word.meaning}`,
        1300
      );

      if (nextLives <= 0) {
        if (gameOverTimerRef.current !== null) {
          window.clearTimeout(gameOverTimerRef.current);
        }
        gameOverTimerRef.current = window.setTimeout(() => {
          gameOverTimerRef.current = null;
          triggerGameOver();
        }, 420);
        return;
      }

      const nextW = buildNextWave();
      waveRef.current = nextW;
      setCurrentWave(nextW);
      gateProgressRef.current = 0;
      resolvingRef.current = false;
    }
  }, [buildNextWave, showQuickToast, triggerGameOver]);

  // 60fps Canvas Render & Physics Loop
  const runCanvasLoop = useCallback(() => {
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrameRef.current) / 1000);
      lastFrameRef.current = now;

      // 1. Advance gate down the bridge
      const baseSpeed = Math.min(0.48, 0.27 + (levelRef.current - 1) * 0.035);
      const currentSpeed = isTurboRef.current ? 3.8 : baseSpeed;

      if (!resolvingRef.current) {
        gateProgressRef.current += currentSpeed * dt;
        roadScrollRef.current = (roadScrollRef.current + currentSpeed * 260 * dt) % 48;
        distanceRef.current += currentSpeed * 22 * dt;

        const wholeMeters = Math.round(distanceRef.current);
        if (wholeMeters !== lastDisplayedMetersRef.current) {
          lastDisplayedMetersRef.current = wholeMeters;
          if (distanceTextRef.current) {
            distanceTextRef.current.textContent = `${wholeMeters}m`;
          }
        }
      }

      // Smoothly interpolate racer X position to target lane
      const targetNormX = (playerLaneRef.current + 0.5) / 3;
      playerVisualXRef.current += (targetNormX - playerVisualXRef.current) * Math.min(1, dt * 16);

      // Decay screen shake
      if (shakeIntensityRef.current > 0.2) {
        shakeIntensityRef.current *= 0.86;
      } else {
        shakeIntensityRef.current = 0;
      }

      // Check collision line
      if (gateProgressRef.current >= 0.82 && !resolvingRef.current) {
        resolveGateCollision();
      }

      // 2. Render Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const parent = canvas.parentElement;
        const cssW = parent?.clientWidth || canvas.clientWidth || 340;
        const cssH = parent?.clientHeight || canvas.clientHeight || 260;
        if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
          canvas.width = Math.round(cssW * dpr);
          canvas.height = Math.round(cssH * dpr);
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.scale(dpr, dpr);

          // Apply subtle camera shake on collision
          if (shakeIntensityRef.current > 0) {
            const sx = (Math.random() - 0.5) * shakeIntensityRef.current;
            const sy = (Math.random() - 0.5) * shakeIntensityRef.current;
            ctx.translate(sx, sy);
          }

          // Sky / Cyber Abyss gradient background
          const bgGrad = ctx.createLinearGradient(0, 0, 0, cssH);
          bgGrad.addColorStop(0, '#090d1e');
          bgGrad.addColorStop(0.45, '#111836');
          bgGrad.addColorStop(1, '#0f172a');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, cssW, cssH);

          // Perspective Bridge Geometry
          const horizonY = 22;
          const bottomY = cssH;
          const topHalfW = cssW * 0.26;
          const bottomHalfW = cssW * 0.48;
          const centerX = cssW / 2;

          const getBridgeBoundsAt = (t: number) => {
            // t in 0..1 from horizon to bottom
            const y = horizonY + (bottomY - horizonY) * t;
            const halfW = topHalfW + (bottomHalfW - topHalfW) * t;
            return { y, left: centerX - halfW, right: centerX + halfW, width: halfW * 2 };
          };

          // Bridge Deck Fill
          const topB = getBridgeBoundsAt(0);
          const botB = getBridgeBoundsAt(1);
          const roadGrad = ctx.createLinearGradient(0, horizonY, 0, bottomY);
          roadGrad.addColorStop(0, '#1e1b4b');
          roadGrad.addColorStop(1, '#1e293b');
          ctx.fillStyle = roadGrad;
          ctx.beginPath();
          ctx.moveTo(topB.left, topB.y);
          ctx.lineTo(topB.right, topB.y);
          ctx.lineTo(botB.right, botB.y);
          ctx.lineTo(botB.left, botB.y);
          ctx.closePath();
          ctx.fill();

          // Glowing Bridge Outer Rails
          ctx.strokeStyle = isTurboRef.current ? '#fbbf24' : '#f43f5e';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(topB.left, topB.y);
          ctx.lineTo(botB.left, botB.y);
          ctx.moveTo(topB.right, topB.y);
          ctx.lineTo(botB.right, botB.y);
          ctx.stroke();

          // 2 Inner Lane Dividers (creating 3 distinct lanes)
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([10, 10]);
          ctx.lineDashOffset = -roadScrollRef.current;
          for (let l = 1; l <= 2; l++) {
            const ratio = l / 3;
            const xTop = topB.left + topB.width * ratio;
            const xBot = botB.left + botB.width * ratio;
            ctx.beginPath();
            ctx.moveTo(xTop, topB.y);
            ctx.lineTo(xBot, botB.y);
            ctx.stroke();
          }
          ctx.setLineDash([]);

          // Highlight Active Selected Lane Floor
          const activeLaneIdx = playerLaneRef.current;
          const lRatio0 = activeLaneIdx / 3;
          const lRatio1 = (activeLaneIdx + 1) / 3;
          ctx.fillStyle = isTurboRef.current
            ? 'rgba(251, 191, 36, 0.16)'
            : 'rgba(56, 189, 248, 0.11)';
          ctx.beginPath();
          ctx.moveTo(topB.left + topB.width * lRatio0, topB.y);
          ctx.lineTo(topB.left + topB.width * lRatio1, topB.y);
          ctx.lineTo(botB.left + botB.width * lRatio1, botB.y);
          ctx.lineTo(botB.left + botB.width * lRatio0, botB.y);
          ctx.closePath();
          ctx.fill();

          // Draw Approaching 3 Energy Gates
          const activeWave = waveRef.current;
          if (activeWave) {
            // Non-linear perspective curve so gate grows naturally as it approaches
            const rawP = Math.max(0, Math.min(1, gateProgressRef.current / 0.82));
            const perspT = Math.pow(rawP, 1.45) * 0.82;
            const gateBounds = getBridgeBoundsAt(perspT);
            const laneW = gateBounds.width / 3;
            const gateH = 22 + 24 * perspT;

            for (let lane = 0; lane < 3; lane++) {
              const gx = gateBounds.left + lane * laneW + 3;
              const gw = laneW - 6;
              const gy = gateBounds.y - gateH;
              const isSelectedLane = lane === playerLaneRef.current;

              // Gate Energy Panel
              ctx.fillStyle = isSelectedLane
                ? 'rgba(14, 165, 233, 0.30)'
                : 'rgba(15, 23, 42, 0.82)';
              ctx.strokeStyle = isSelectedLane ? '#38bdf8' : '#818cf8';
              ctx.lineWidth = isSelectedLane ? 2 : 1.3;

              drawRoundedRectPath(ctx, gx, gy, gw, gateH, 7);
              ctx.fill();
              ctx.stroke();

              // Gate Option Label
              const label = activeWave.options[lane];
              const fontSize = Math.max(10, Math.min(15, Math.round(9.5 + 6 * perspT)));
              ctx.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
              ctx.fillStyle = '#f8fafc';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              // Truncate cleanly if long Vietnamese text on narrow far gate
              let displayLabel = label;
              if (ctx.measureText(displayLabel).width > gw - 6) {
                while (
                  displayLabel.length > 2 &&
                  ctx.measureText(displayLabel + '…').width > gw - 6
                ) {
                  displayLabel = displayLabel.slice(0, -1);
                }
                displayLabel += '…';
              }
              ctx.fillText(displayLabel, gx + gw / 2, gy + gateH / 2);
            }
          }

          // Draw Player Futuristic Hover-Racer at t = 0.84
          const playerBounds = getBridgeBoundsAt(0.84);
          const px =
            playerBounds.left + playerBounds.width * playerVisualXRef.current;
          const py = playerBounds.y;

          // Thruster Flame
          const flameLen = isTurboRef.current
            ? 24 + Math.random() * 10
            : 11 + Math.random() * 6;
          const flameGrad = ctx.createLinearGradient(px, py + 8, px, py + 8 + flameLen);
          flameGrad.addColorStop(0, isTurboRef.current ? '#fef08a' : '#38bdf8');
          flameGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.moveTo(px - 8, py + 8);
          ctx.lineTo(px + 8, py + 8);
          ctx.lineTo(px, py + 8 + flameLen);
          ctx.closePath();
          ctx.fill();

          // Hover-Racer Body (Sleek Delta Craft)
          ctx.fillStyle = '#f43f5e';
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(px, py - 16); // nose
          ctx.lineTo(px + 18, py + 9); // right wing
          ctx.lineTo(px + 6, py + 6);
          ctx.lineTo(px - 6, py + 6);
          ctx.lineTo(px - 18, py + 9); // left wing
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Cockpit Canopy
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.ellipse(px, py - 3, 4.5, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Update & Draw Particles
          const remainingParticles: Particle[] = [];
          for (const p of particlesRef.current) {
            p.life += dt;
            if (p.life < p.maxLife) {
              p.x += (p.vx * dt) / cssW;
              p.y += (p.vy * dt) / cssH;
              const alpha = Math.max(0, 1 - p.life / p.maxLife);
              ctx.globalAlpha = alpha;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x * cssW, p.y * cssH, p.size, 0, Math.PI * 2);
              ctx.fill();
              remainingParticles.push(p);
            }
          }
          ctx.globalAlpha = 1;
          particlesRef.current = remainingParticles;

          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    lastFrameRef.current = performance.now();
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
  }, [resolveGateCollision]);

  const handleStartGame = () => {
    audioService.playClick();
    stopLoop();

    livesRef.current = 3;
    scoreRef.current = 0;
    distanceRef.current = 0;
    lastDisplayedMetersRef.current = 0;
    levelRef.current = 1;
    comboRef.current = 0;
    maxComboRef.current = 0;
    gatesClearedRef.current = 0;
    playerLaneRef.current = 1;
    playerVisualXRef.current = 0.5;
    gateProgressRef.current = 0;
    isTurboRef.current = false;
    resolvingRef.current = false;
    particlesRef.current = [];
    masteredSetRef.current = new Set();

    setIsNewRecord(false);
    setLives(3);
    setScore(0);
    setDistance(0);
    setLevel(1);
    setCombo(0);
    setMaxCombo(0);
    setPlayerLane(1);
    setMissedWords([]);
    setFeedbackToast(null);

    const firstWave = buildNextWave();
    waveRef.current = firstWave;
    setCurrentWave(firstWave);
    setPhase('playing');

    runCanvasLoop();
  };

  const handleSelectLane = useCallback(
    (lane: 0 | 1 | 2, autoDashIfSame: boolean = true) => {
      if (phase !== 'playing' || livesRef.current <= 0 || resolvingRef.current) return;
      if (playerLaneRef.current === lane && autoDashIfSame) {
        // Tapping current lane triggers instant Turbo Dash through the gate!
        if (!isTurboRef.current) {
          isTurboRef.current = true;
          audioService.playLaserDash();
        }
      } else {
        playerLaneRef.current = lane;
        setPlayerLane(lane);
        audioService.playClick();
      }
    },
    [phase]
  );

  const handleTriggerTurboDash = useCallback(() => {
    if (phase !== 'playing' || isTurboRef.current || livesRef.current <= 0 || resolvingRef.current) {
      return;
    }
    isTurboRef.current = true;
    audioService.playLaserDash();
    try {
      navigator.vibrate?.([20, 25, 30]);
    } catch {}
  }, [phase]);

  // Keyboard navigation: Left/Right switches lanes, Up/Space activates Turbo Dash, 1/2/3 picks lane
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
        const next = Math.max(0, playerLaneRef.current - 1) as 0 | 1 | 2;
        handleSelectLane(next, false);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        const next = Math.min(2, playerLaneRef.current + 1) as 0 | 1 | 2;
        handleSelectLane(next, false);
      } else if (e.code === 'ArrowUp' || e.code === 'Space') {
        e.preventDefault();
        handleTriggerTurboDash();
      } else if (e.code === 'Digit1') {
        handleSelectLane(0, true);
      } else if (e.code === 'Digit2') {
        handleSelectLane(1, true);
      } else if (e.code === 'Digit3') {
        handleSelectLane(2, true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSelectLane, handleTriggerTurboDash, phase]);

  useEffect(() => {
    return () => {
      stopLoop();
      audioService.stopSpeech();
    };
  }, [stopLoop]);

  return (
    <div className="flex-1 max-w-md mx-auto w-full p-4 pb-24 flex flex-col select-none animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-2.5">
        <button
          onClick={() => {
            audioService.playClick();
            stopLoop();
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
          <span>Kỷ lục: {Math.max(bestScore, score)}đ</span>
        </div>
      </div>

      {/* READY SCREEN */}
      {phase === 'ready' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-800/60 border border-slate-750 rounded-3xl p-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/50 mb-4">
            <Rocket className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 mb-1.5">
            Vượt Cầu Sinh Tử
          </h2>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-5">
            Điều khiển phi thuyền chuyển làn trên cầu ánh sáng để lao qua{' '}
            <span className="text-cyan-300 font-bold">Cổng Năng Lượng Đúng</span>! Chạm lần 2 vào
            làn đang chọn (hoặc ấn <span className="text-amber-300 font-bold">Tăng Tốc</span>) để
            phóng xuyên cổng nhận thưởng tốc độ!
          </p>

          <div className="grid grid-cols-3 gap-2 w-full mb-6 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-850/90 border border-slate-700/70">
              <div className="text-cyan-400 font-bold">3 Làn Đua</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Chạm / Vuốt mượt</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-850/90 border border-slate-700/70">
              <div className="text-amber-400 font-bold">Turbo +35đ</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Phóng nhanh qua ải</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-850/90 border border-slate-700/70">
              <div className="text-emerald-400 font-bold">Tăng Cấp</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Mỗi 5 cổng vượt</div>
            </div>
          </div>

          <button
            data-testid="runner-start-btn"
            onClick={handleStartGame}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-cyan-950/50 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Rocket className="w-4 h-4" />
            <span>XUẤT PHÁT ĐUA VƯỢT CỔNG</span>
          </button>
        </div>
      )}

      {/* PLAYING SCREEN */}
      {phase === 'playing' && currentWave && (
        <div className="flex-1 flex flex-col space-y-2">
          {/* HUD Bar */}
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-800/90 border border-slate-750 text-xs">
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((idx) => (
                <Heart
                  key={idx}
                  className={`w-4 h-4 transition-all ${
                    idx <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold text-[11px]">
                <Gauge className="w-3 h-3" />
                <span>Lv.{level}</span>
              </span>
              <span ref={distanceTextRef} className="text-slate-400 font-semibold tabular-nums">
                {distance}m
              </span>
              {combo >= 2 && (
                <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold text-[11px]">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>x{combo}</span>
                </span>
              )}
            </div>

            <div className="font-black text-amber-300 tabular-nums">{score}đ</div>
          </div>

          {/* Target Prompt Card */}
          <div className="px-3.5 py-2.5 rounded-2xl bg-slate-800/95 border border-cyan-500/30 flex items-center justify-between gap-2 shadow-md">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
                {currentWave.mode === 'hanzi_to_vi'
                  ? 'Tìm cổng nghĩa tiếng Việt của:'
                  : 'Tìm cổng Chữ Hán tương ứng:'}
              </div>
              <div className="flex items-baseline gap-2 flex-wrap mt-0.5">
                <span
                  data-testid="runner-prompt"
                  className={`font-extrabold text-white ${
                    currentWave.mode === 'hanzi_to_vi' ? 'text-2xl' : 'text-base sm:text-lg'
                  }`}
                >
                  {currentWave.promptMain}
                </span>
                {currentWave.promptSub && (
                  <span className="text-xs text-rose-300 font-medium pinyin-text">
                    {currentWave.promptSub}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => audioService.speakChinese(currentWave.word.hanzi)}
              className="p-2 rounded-xl bg-slate-750 hover:bg-slate-700 text-cyan-300 border border-slate-600/60 shrink-0"
              title="Nghe phát âm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* 60fps Sky-Bridge Track Canvas */}
          <div
            className="relative flex-1 min-h-[210px] rounded-2xl overflow-hidden border border-slate-750 shadow-inner bg-slate-950"
            onTouchStart={(e) => {
              touchStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
              };
            }}
            onTouchEnd={(e) => {
              if (!touchStartRef.current) return;
              const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
              const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
              touchStartRef.current = null;

              if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
                if (dx < 0) {
                  handleSelectLane(Math.max(0, playerLaneRef.current - 1) as 0 | 1 | 2, false);
                } else {
                  handleSelectLane(Math.min(2, playerLaneRef.current + 1) as 0 | 1 | 2, false);
                }
              } else if (dy < -35) {
                handleTriggerTurboDash();
              }
            }}
          >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

            {/* Invisible Direct Tap Columns on Canvas (tap lane directly!) */}
            <div className="absolute inset-0 grid grid-cols-3">
              {[0, 1, 2].map((laneIdx) => (
                <button
                  key={laneIdx}
                  type="button"
                  aria-label={`Chuyển sang làn ${laneIdx + 1}`}
                  onClick={() => handleSelectLane(laneIdx as 0 | 1 | 2, true)}
                  className="h-full w-full bg-transparent focus:outline-none"
                />
              ))}
            </div>

            {/* Feedback Banner Overlay */}
            {feedbackToast && (
              <div
                className={`absolute top-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-center backdrop-blur-md pointer-events-none animate-fadeIn ${
                  feedbackToast.type === 'correct'
                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40'
                    : feedbackToast.type === 'levelup'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                    : 'bg-rose-500/30 text-rose-100 border border-rose-400/50'
                }`}
              >
                {feedbackToast.text}
              </div>
            )}
          </div>

          {/* 3 Crisp Lane Selector Pads + Turbo Boost Button */}
          <div className="grid grid-cols-3 gap-2">
            {([0, 1, 2] as const).map((laneIdx) => {
              const isSelected = playerLane === laneIdx;
              const optionText = currentWave.options[laneIdx];
              return (
                <button
                  key={laneIdx}
                  type="button"
                  data-testid={`runner-lane-${laneIdx}`}
                  data-is-correct={laneIdx === currentWave.correctLane ? 'true' : 'false'}
                  onClick={() => handleSelectLane(laneIdx, true)}
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center justify-center min-h-[60px] ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-950/50'
                      : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                    {isSelected ? '⚡ Chạm phóng' : `Cổng ${laneIdx + 1}`}
                  </span>
                  <span
                    className={`font-bold leading-snug line-clamp-2 ${
                      currentWave.mode === 'vi_to_hanzi' ? 'text-lg text-white' : 'text-xs'
                    }`}
                  >
                    {optionText}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            data-testid="runner-dash-btn"
            onClick={handleTriggerTurboDash}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-950/30 transition-all"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>PHÓNG TURBO XUYÊN CỔNG (+35Đ)</span>
          </button>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {phase === 'gameover' && (
        <div
          data-testid="runner-gameover"
          className="flex-1 flex flex-col bg-slate-800/70 border border-slate-750 rounded-3xl p-5 shadow-xl space-y-4 animate-fadeIn"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 mb-2">
              <Rocket className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Hoàn Thành Chặng Đua!</h2>
            <p className="text-3xl font-black text-amber-400 mt-1 tabular-nums">{score} điểm</p>
            {isNewRecord && (
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-extrabold text-amber-300">
                🎉 KỶ LỤC MỚI!
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-750">
              <div className="text-slate-400 text-[10px]">Quãng Đường</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">{distance}m</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-750">
              <div className="text-slate-400 text-[10px]">Tốc Độ Đạt</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">Lv.{level}</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-750">
              <div className="text-slate-400 text-[10px]">Combo Đỉnh</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">x{maxCombo}</div>
            </div>
          </div>

          {missedWords.length > 0 && (
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="text-xs font-bold text-slate-300 mb-2">
                Các cổng vừa va chạm ({missedWords.length}):
              </div>
              <div className="space-y-1.5 overflow-y-auto max-h-40 pr-1">
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
              className="py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-950/40 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đua lại ngay</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
