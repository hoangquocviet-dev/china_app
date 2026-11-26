import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Volume2,
  ChevronLeft,
  RotateCcw,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';
import { storageService } from '../../utils/storage';

interface ToneMasterGameProps {
  words: ChineseWord[];
  onBack: () => void;
}

const TONE_1_VOWELS = ['ā', 'ē', 'ī', 'ō', 'ū', 'ǖ', 'Ā', 'Ē', 'Ī', 'Ō', 'Ū', 'Ǖ'];
const TONE_2_VOWELS = ['á', 'é', 'í', 'ó', 'ú', 'ǘ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ǘ'];
const TONE_3_VOWELS = ['ǎ', 'ě', 'ǐ', 'ǒ', 'ǔ', 'ǚ', 'Ǎ', 'Ě', 'Ǐ', 'Ǒ', 'Ǔ', 'Ǚ'];
const TONE_4_VOWELS = ['à', 'è', 'ì', 'ò', 'ù', 'ǜ', 'À', 'È', 'Ì', 'Ò', 'Ù', 'Ǜ'];

function detectTone(pinyin: string): 1 | 2 | 3 | 4 | null {
  for (const ch of pinyin) {
    if (TONE_1_VOWELS.includes(ch)) return 1;
    if (TONE_2_VOWELS.includes(ch)) return 2;
    if (TONE_3_VOWELS.includes(ch)) return 3;
    if (TONE_4_VOWELS.includes(ch)) return 4;
  }
  return null;
}

interface ToneDefinition {
  id: 1 | 2 | 3 | 4;
  label: string;
  symbol: string;
  pitch: string;
  vowelSample: string;
  description: string;
  contourPath: string; // SVG path for visual pitch contour
  colorClass: string;
}

const TONE_DEFS: ToneDefinition[] = [
  {
    id: 1,
    label: 'Thanh 1',
    symbol: '—',
    pitch: '5-5',
    vowelSample: 'mā',
    description: 'Cao ngang, giữ đều giọng (như tiếng hát)',
    contourPath: 'M 10 20 L 90 20',
    colorClass: 'border-sky-500/40 text-sky-300 hover:bg-sky-500/15',
  },
  {
    id: 2,
    label: 'Thanh 2',
    symbol: '/',
    pitch: '3-5',
    vowelSample: 'má',
    description: 'Vút lên cao dứt khoát (như dấu sắc)',
    contourPath: 'M 10 60 L 90 20',
    colorClass: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/15',
  },
  {
    id: 3,
    label: 'Thanh 3',
    symbol: '∨',
    pitch: '2-1-4',
    vowelSample: 'mǎ',
    description: 'Hạ sâu xuống đáy rồi hơi lượn nhẹ lên',
    contourPath: 'M 10 50 Q 50 85 90 35',
    colorClass: 'border-amber-500/40 text-amber-300 hover:bg-amber-500/15',
  },
  {
    id: 4,
    label: 'Thanh 4',
    symbol: '\\',
    pitch: '5-1',
    vowelSample: 'mà',
    description: 'Hạ mạnh dứt khoát từ đỉnh cao xuống đáy',
    contourPath: 'M 10 20 L 90 80',
    colorClass: 'border-rose-500/40 text-rose-300 hover:bg-rose-500/15',
  },
];

interface ToneQuestion {
  word: ChineseWord;
  correctTone: 1 | 2 | 3 | 4;
}

const BEST_SCORE_KEY = 'hanziflow_tone_best_score';

export const ToneMasterGame: React.FC<ToneMasterGameProps> = ({ words, onBack }) => {
  // Filter words that have a clear 1 to 4 tone
  const validWords = useMemo(() => {
    return words.filter((w) => detectTone(w.pinyin) !== null);
  }, [words]);

  const [questions, setQuestions] = useState<ToneQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedTone, setSelectedTone] = useState<(1 | 2 | 3 | 4) | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showPitchChart, setShowPitchChart] = useState(false);

  const [bestScore, setBestScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(BEST_SCORE_KEY);
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });

  // Generate 10 randomized questions
  const initGame = useCallback(() => {
    if (validWords.length === 0) return;
    const shuffled = [...validWords].sort(() => Math.random() - 0.5);
    const slice = shuffled.slice(0, Math.min(10, shuffled.length));
    const qs: ToneQuestion[] = slice.map((w) => ({
      word: w,
      correctTone: detectTone(w.pinyin) as 1 | 2 | 3 | 4,
    }));

    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelectedTone(null);
    setIsAnswered(false);
    setIsFinished(false);

    // Auto-play the first word's audio
    if (qs[0]) {
      setTimeout(() => {
        audioService.speakChinese(qs[0].word.hanzi);
      }, 350);
    }
  }, [validWords]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentQ = questions[currentIndex];

  const handleSelectTone = (tone: 1 | 2 | 3 | 4) => {
    if (isAnswered || !currentQ) return;
    setSelectedTone(tone);
    setIsAnswered(true);

    const isCorrect = tone === currentQ.correctTone;
    if (isCorrect) {
      audioService.playSuccessChime();
      try {
        navigator.vibrate?.(15);
      } catch {}
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      const pointsEarned = 10 + Math.min(nextStreak * 2, 10);
      setScore((prev) => prev + pointsEarned);
    } else {
      audioService.playErrorBuzz();
      try {
        navigator.vibrate?.([30, 40, 30]);
      } catch {}
      setStreak(0);
    }

    storageService.recordStudyActivity();
  };

  const handleNextQuestion = () => {
    audioService.playClick();
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedTone(null);
      setIsAnswered(false);

      if (questions[nextIdx]) {
        setTimeout(() => {
          audioService.speakChinese(questions[nextIdx].word.hanzi);
        }, 200);
      }
    } else {
      // Game Finished
      setIsFinished(true);
      const finalScore = score + (selectedTone === currentQ.correctTone ? 10 : 0);
      if (finalScore > bestScore) {
        setBestScore(finalScore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(BEST_SCORE_KEY, finalScore.toString());
        }
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleReplaySpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playClick();
    if (currentQ) {
      audioService.speakChinese(currentQ.word.hanzi);
    }
  };

  // Rank determination
  const rank = useMemo(() => {
    if (score >= 90) return { title: 'Thần Đồng Thanh Điệu 🏆', color: 'text-amber-400' };
    if (score >= 70) return { title: 'Phản Xạ Xuất Sắc 🌟', color: 'text-emerald-400' };
    if (score >= 50) return { title: 'Đạt Tiêu Chuẩn 👍', color: 'text-sky-400' };
    return { title: 'Cần Luyện Nghe Thêm 💪', color: 'text-rose-400' };
  }, [score]);

  if (validWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <p className="text-slate-400 text-sm">Chưa có đủ từ vựng để tạo bài luyện thanh điệu.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
        >
          Quay lại sảnh trò chơi
        </button>
      </div>
    );
  }

  // --- SCORECARD FINISH VIEW ---
  if (isFinished) {
    return (
      <div className="flex flex-col flex-1 max-w-md w-full mx-auto p-4 pb-20 animate-in fade-in duration-300">
        <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-amber-900/40">
            <Trophy className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            KẾT QUẢ PHẢN XẠ THANH ĐIỆU
          </span>
          <h2 className={`text-2xl font-black mt-1 ${rank.color}`}>{rank.title}</h2>

          <div className="my-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-around">
            <div>
              <div className="text-3xl font-black text-slate-100">{score}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                Điểm số
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-0.5">
                <span>{bestStreak}</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                Max Combo
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-3xl font-black text-emerald-400">{bestScore}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                Kỷ lục
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={initGame}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-900/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Luyện lại ván mới</span>
            </button>
            <button
              onClick={onBack}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Về sảnh trò chơi</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="flex flex-col flex-1 max-w-md w-full mx-auto p-4 pb-24">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-0.5" />
          <span>Thoát</span>
        </button>

        <div className="flex items-center space-x-2">
          {streak > 1 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>x{streak} Combo</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold">
            {score}đ
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750 shadow-2xl flex flex-col items-center text-center mb-4">
        <div className="flex items-center justify-between w-full text-[11px] text-slate-400 mb-2">
          <span className="font-semibold text-rose-400">
            Câu {currentIndex + 1} / {questions.length}
          </span>
          <button
            onClick={() => setShowPitchChart(!showPitchChart)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
          >
            <HelpCircle className="w-3 h-3 text-sky-400" />
            <span>{showPitchChart ? 'Ẩn sơ đồ cao độ' : 'Xem sơ đồ 4 thanh'}</span>
          </button>
        </div>

        {/* Central Hanzi & Audio Trigger */}
        <div className="my-3 flex flex-col items-center">
          <div className="text-6xl sm:text-7xl font-bold text-slate-100 tracking-wider mb-2">
            {currentQ.word.hanzi}
          </div>

          <button
            data-testid="tone-listen-audio-btn"
            onClick={handleReplaySpeech}
            className="flex items-center space-x-1.5 py-2 px-4 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-all active:scale-95 shadow-md"
            title="Nghe lại phát âm"
          >
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>Nghe phát âm</span>
          </button>

          {/* Meaning & Hanviet hint */}
          <div className="mt-2 text-xs text-slate-400">
            <span>{currentQ.word.meaning}</span>
            {currentQ.word.hanviet && (
              <span className="text-amber-400/90 font-medium ml-1">
                ({currentQ.word.hanviet})
              </span>
            )}
          </div>
        </div>

        {/* Pitch Chart Guide Accordion */}
        {showPitchChart && (
          <div className="w-full my-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-left animate-fadeIn space-y-1.5">
            <div className="font-bold text-slate-300 border-b border-slate-800 pb-1">
              Sơ đồ cao độ 4 thanh tiếng Trung (5 mức):
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-sky-400 font-bold">Thanh 1 (—):</span> Cao 55, giữ ngang đều
              </div>
              <div>
                <span className="text-emerald-400 font-bold">Thanh 2 (/):</span> Vút từ 3 lên 5
              </div>
              <div>
                <span className="text-amber-400 font-bold">Thanh 3 (∨):</span> Hạ 2 xuống 1 rồi lên 4
              </div>
              <div>
                <span className="text-rose-400 font-bold">Thanh 4 (\):</span> Rơi dốc từ 5 xuống 1
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-300 font-semibold mt-1">
          {isAnswered
            ? 'Pinyin chuẩn: ' + currentQ.word.pinyin
            : 'Từ trên mang thanh điệu số mấy?'}
        </div>
      </div>

      {/* 4 Interactive Tone Choice Buttons */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {TONE_DEFS.map((def) => {
          let btnStyle = `bg-slate-850 border border-slate-750 text-slate-200 hover:border-slate-600 ${def.colorClass}`;

          if (isAnswered) {
            if (def.id === currentQ.correctTone) {
              btnStyle = 'bg-emerald-950/70 border-2 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950/50';
            } else if (selectedTone === def.id) {
              btnStyle = 'bg-rose-950/70 border-2 border-rose-500 text-rose-200';
            } else {
              btnStyle = 'bg-slate-900 border border-slate-800 text-slate-600 opacity-40';
            }
          }

          return (
            <button
              key={def.id}
              data-testid={`tone-choice-btn-${def.id}`}
              disabled={isAnswered}
              onClick={() => handleSelectTone(def.id)}
              className={`p-3 rounded-2xl flex flex-col justify-between transition-all active:scale-98 text-left ${btnStyle}`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-black">{def.label}</span>
                <span className="text-sm font-black font-mono">{def.symbol}</span>
              </div>

              {/* Pitch contour wave representation */}
              <div className="w-full h-5 my-1 flex items-center justify-center">
                <svg className="w-16 h-5" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d={def.contourPath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between w-full text-[10px] text-slate-400 mt-1">
                <span className="italic">{def.vowelSample}</span>
                <span className="font-semibold text-slate-500">{def.pitch}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Answer Feedback & Advance CTA */}
      {isAnswered && (
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-750 flex items-center justify-between animate-in fade-in duration-200 shadow-xl">
          <div className="flex items-center space-x-2">
            {selectedTone === currentQ.correctTone ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>
                  {selectedTone === currentQ.correctTone ? 'Chính xác! (+10đ)' : 'Chưa đúng rồi!'}
                </span>
                <span className="text-rose-400 font-semibold pinyin-text">
                  ({currentQ.word.pinyin})
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {TONE_DEFS[currentQ.correctTone - 1].description}
              </div>
            </div>
          </div>

          <button
            data-testid="tone-next-btn"
            onClick={handleNextQuestion}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-rose-900/30 active:scale-95 transition-all shrink-0"
          >
            {currentIndex < questions.length - 1 ? 'Câu tiếp' : 'Xem điểm'}
          </button>
        </div>
      )}
    </div>
  );
};
