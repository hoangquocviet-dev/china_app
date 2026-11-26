import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Volume2,
  ChevronLeft,
  RotateCcw,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Headphones,
  Snail,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';

interface ListeningMasterGameProps {
  words: ChineseWord[];
  onBack: () => void;
  onComplete?: (score: number) => void;
}

interface QuestionRound {
  targetWord: ChineseWord;
  options: ChineseWord[];
}

const TOTAL_ROUNDS = 10;

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const ListeningMasterGame: React.FC<ListeningMasterGameProps> = ({
  words,
  onBack,
  onComplete,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showPinyinHint, setShowPinyinHint] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [answersLog, setAnswersLog] = useState<Array<{ word: ChineseWord; isCorrect: boolean }>>([]);
  const [bestScore, setBestScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('hanziflow_listening_best_score');
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });

  const autoPlayTimeoutRef = useRef<any>(null);

  // Generate 10 randomized rounds from available words
  const rounds: QuestionRound[] = useMemo(() => {
    if (!words || words.length === 0) return [];

    const pool = shuffleArray(words);
    const selectedTargets = pool.slice(0, Math.min(TOTAL_ROUNDS, pool.length));

    return selectedTargets.map((target) => {
      // 3 distractors
      const distractors = pool.filter((w) => w.id !== target.id);
      const chosenDistractors = shuffleArray(distractors).slice(0, 3);
      const options = shuffleArray([target, ...chosenDistractors]);
      return { targetWord: target, options };
    });
  }, [words]);

  const currentRound = rounds[currentRoundIdx];

  // Auto-play audio when a new round starts
  useEffect(() => {
    if (!currentRound || isGameOver) return;

    setIsAnswerChecked(false);
    setSelectedWordId(null);
    setShowPinyinHint(false);

    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);

    autoPlayTimeoutRef.current = setTimeout(() => {
      audioService.speakChinese(currentRound.targetWord.hanzi, 1.0);
    }, 300);

    return () => {
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    };
  }, [currentRoundIdx, currentRound, isGameOver]);

  const handlePlayAudio = useCallback(
    (rate = 1.0) => {
      if (!currentRound) return;
      audioService.speakChinese(currentRound.targetWord.hanzi, rate);
    },
    [currentRound]
  );

  const handleSelectOption = (word: ChineseWord) => {
    if (isAnswerChecked || !currentRound) return;

    setSelectedWordId(word.id);
    setIsAnswerChecked(true);

    const isCorrect = word.id === currentRound.targetWord.id;

    if (isCorrect) {
      audioService.playSuccessChime();
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setAnswersLog((prev) => [...prev, { word: currentRound.targetWord, isCorrect: true }]);
    } else {
      audioService.playErrorBuzz();
      setStreak(0);
      setAnswersLog((prev) => [...prev, { word: currentRound.targetWord, isCorrect: false }]);
    }
  };

  const handleNextRound = () => {
    if (currentRoundIdx + 1 < rounds.length) {
      setCurrentRoundIdx((prev) => prev + 1);
    } else {
      // Game over
      setIsGameOver(true);
      if (score >= bestScore) {
        setBestScore(score);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('hanziflow_listening_best_score', score.toString());
        }
      }
      onComplete?.(score);

      if (score >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setSelectedWordId(null);
    setIsAnswerChecked(false);
    setShowPinyinHint(false);
    setIsGameOver(false);
    setAnswersLog([]);
  };

  if (!currentRound && !isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <p className="text-sm">Không có đủ từ vựng để bắt đầu thử thách luyện nghe.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // Final Scorecard View
  if (isGameOver) {
    const accuracy = Math.round((score / (rounds.length * 10)) * 100);
    let ratingTitle = 'Cần Luyện Thêm 🎧';
    let ratingDesc = 'Hãy nghe thêm hàng ngày để rèn luyện phản xạ đôi tai nhạy bén!';

    if (accuracy >= 90) {
      ratingTitle = 'Tai Vàng Bản Xứ 🏆';
      ratingDesc = 'Thính lực tuyệt đỉnh! Bạn nhận diện từ vựng chuẩn xác như người bản xứ.';
    } else if (accuracy >= 70) {
      ratingTitle = 'Thính Lực Cấp Tốc ⭐';
      ratingDesc = 'Rất ấn tượng! Phản xạ nghe của bạn đã đạt tiêu chuẩn HSK xuất sắc.';
    }

    return (
      <div className="max-w-xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in" data-testid="listening-game-scorecard">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trở về</span>
          </button>
          <span className="text-xs font-bold text-slate-400">KẾT QUẢ LUYỆN NGHE</span>
        </div>

        {/* Scorecard Hero */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-850 to-slate-900 border border-indigo-500/30 text-center shadow-2xl space-y-5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{ratingTitle}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{ratingDesc}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <div className="text-2xl font-black text-indigo-400">{score}</div>
              <div className="text-[11px] text-slate-500 uppercase font-semibold">Điểm số</div>
            </div>
            <div className="border-x border-slate-800">
              <div className="text-2xl font-black text-emerald-400">{accuracy}%</div>
              <div className="text-[11px] text-slate-500 uppercase font-semibold">Chính xác</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">{maxStreak}🔥</div>
              <div className="text-[11px] text-slate-500 uppercase font-semibold">Chuỗi cao nhất</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Luyện lại vòng mới</span>
            </button>
            <button
              onClick={onBack}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-sm transition-all active:scale-95"
            >
              Quay lại
            </button>
          </div>
        </div>

        {/* Word Review List */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Danh sách từ trong bài nghe ({answersLog.length})
          </div>
          <div className="space-y-2">
            {answersLog.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      item.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {item.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>{item.word.hanzi}</span>
                      <span className="text-xs text-indigo-400 font-medium">[{item.word.pinyin}]</span>
                    </div>
                    <div className="text-xs text-slate-400">{item.word.meaning}</div>
                  </div>
                </div>

                <button
                  onClick={() => audioService.speakChinese(item.word.hanzi)}
                  className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Active Game View
  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 space-y-6" data-testid="listening-game-container">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-all active:scale-95 touch-manipulation select-none"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Thoát</span>
        </button>

        {/* Progress & Streak */}
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30 animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streak} combo!</span>
            </div>
          )}

          <div className="text-xs font-bold text-slate-400">
            Câu <span className="text-indigo-400 font-black">{currentRoundIdx + 1}</span> / {rounds.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${((currentRoundIdx + 1) / rounds.length) * 100}%` }}
        />
      </div>

      {/* Listening Audio Center Hero */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750 text-center shadow-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
          <Headphones className="w-3.5 h-3.5" />
          <span>Lắng nghe phát âm và chọn nghĩa đúng</span>
        </div>

        {/* Audio speaker button */}
        <div className="flex justify-center">
          <button
            onClick={() => handlePlayAudio(1.0)}
            data-testid="replay-audio-btn"
            title="Bấm để nghe lại"
            className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:scale-105 active:scale-90 transition-all group touch-manipulation select-none"
          >
            <Volume2 className="w-14 h-14 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Audio control pill buttons */}
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
          <button
            onClick={() => handlePlayAudio(1.0)}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700 touch-manipulation select-none"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Nghe lại (1.0x)</span>
          </button>

          <button
            onClick={() => handlePlayAudio(0.75)}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700 touch-manipulation select-none"
            title="Phát âm chậm 0.75x để nghe rõ thanh điệu"
          >
            <Snail className="w-3.5 h-3.5 text-amber-400" />
            <span>Nghe chậm (0.75x)</span>
          </button>

          <button
            onClick={() => setShowPinyinHint(!showPinyinHint)}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700 touch-manipulation select-none"
          >
            {showPinyinHint ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-sky-400" />}
            <span>{showPinyinHint ? 'Ẩn Pinyin' : 'Gợi ý Pinyin'}</span>
          </button>
        </div>

        {/* Pinyin Hint Reveal */}
        {showPinyinHint && (
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-bold tracking-wide animate-fade-in">
            💡 Gợi ý phiên âm: <span className="text-white text-base">{currentRound.targetWord.pinyin}</span>
          </div>
        )}
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentRound.options.map((option, idx) => {
          const isSelected = selectedWordId === option.id;
          const isCorrect = option.id === currentRound.targetWord.id;

          let btnClass =
            'min-h-[68px] p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1 relative touch-manipulation select-none ';

          if (!isAnswerChecked) {
            btnClass +=
              'bg-slate-850 hover:bg-slate-800 border-slate-750 hover:border-indigo-500/50 text-slate-100 active:scale-95 shadow-sm';
          } else if (isCorrect) {
            btnClass +=
              'bg-emerald-950/40 border-emerald-500 text-white font-bold ring-2 ring-emerald-500/50';
          } else if (isSelected) {
            btnClass += 'bg-rose-950/40 border-rose-500 text-white font-bold';
          } else {
            btnClass += 'bg-slate-900 border-slate-800 opacity-40 text-slate-500';
          }

          return (
            <button
              key={option.id}
              disabled={isAnswerChecked}
              onClick={() => handleSelectOption(option)}
              className={btnClass}
              data-testid={`option-btn-${idx}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-slate-100">{option.hanzi}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                  {option.pinyin}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium line-clamp-1">{option.meaning}</div>
            </button>
          );
        })}
      </div>

      {/* Explanation & Next Button on Answer Checked */}
      {isAnswerChecked && (
        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white">{currentRound.targetWord.hanzi}</span>
              <span className="text-xs text-indigo-400 font-bold">[{currentRound.targetWord.pinyin}]</span>
              {currentRound.targetWord.hanviet && (
                <span className="text-xs text-slate-400">({currentRound.targetWord.hanviet})</span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-300">{currentRound.targetWord.meaning}</span>
          </div>

          <button
            onClick={handleNextRound}
            data-testid="next-round-btn"
            className="w-full min-h-[50px] py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation select-none"
          >
            <span>{currentRoundIdx + 1 < rounds.length ? 'Câu tiếp theo' : 'Xem bảng kết quả'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
