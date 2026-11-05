import React, { useState, useEffect } from 'react';
import { Volume2, Check, RotateCcw, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_SENTENCES } from '../../data/hsk1Sentences';
import type { SentenceExercise } from '../../types';
import { audioService } from '../../utils/audio';

interface AssemblyViewProps {
  sentences?: SentenceExercise[];
}

export const AssemblyView: React.FC<AssemblyViewProps> = ({ sentences = INITIAL_SENTENCES }) => {
  const activeSentences = sentences && sentences.length > 0 ? sentences : INITIAL_SENTENCES;
  const [exerciseIndex, setExerciseIndex] = useState(0);

  // Helper to initialize available tokens (shuffled correct tokens + distractors)
  const getShuffledTokens = (exIndex: number, list: SentenceExercise[]) => {
    const ex = list[exIndex] || list[0];
    if (!ex) return [];
    const all = [...ex.tokens, ...(ex.distractorTokens || [])];
    return all.sort(() => Math.random() - 0.5);
  };

  const [availableTokens, setAvailableTokens] = useState<string[]>(() =>
    getShuffledTokens(exerciseIndex, activeSentences)
  );
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setExerciseIndex(0);
    setAvailableTokens(getShuffledTokens(0, activeSentences));
    setSelectedTokens([]);
    setIsEvaluated(false);
    setIsCorrect(false);
  }, [sentences]);

  const currentExercise = activeSentences[exerciseIndex] || activeSentences[0];

  const resetState = (newIndex: number) => {
    setExerciseIndex(newIndex);
    setAvailableTokens(getShuffledTokens(newIndex, activeSentences));
    setSelectedTokens([]);
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  const handleSelectToken = (token: string, tokenIndex: number) => {
    if (isEvaluated && isCorrect) return;
    audioService.playClick();
    setSelectedTokens((prev) => [...prev, token]);
    setAvailableTokens((prev) => prev.filter((_, idx) => idx !== tokenIndex));
  };

  const handleDeselectToken = (token: string, tokenIndex: number) => {
    if (isEvaluated && isCorrect) return;
    audioService.playClick();
    setSelectedTokens((prev) => prev.filter((_, idx) => idx !== tokenIndex));
    setAvailableTokens((prev) => [...prev, token]);
  };

  const handleCheck = () => {
    const joined = selectedTokens.join('');
    const targetClean = currentExercise.targetSentence.replace(/[。，！？.!?\s]/g, '');
    const joinedClean = joined.replace(/[。，！？.!?\s]/g, '');

    const correct = joinedClean === targetClean;
    setIsEvaluated(true);
    setIsCorrect(correct);

    if (correct) {
      audioService.playSuccessChime();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.75 },
      });
      // Allow success chime to play clearly, then speak full Chinese sentence
      setTimeout(() => {
        audioService.speakChinese(currentExercise.targetSentence);
      }, 350);
    } else {
      audioService.playErrorBuzz();
    }
  };

  const handleResetCurrent = () => {
    audioService.playClick();
    setAvailableTokens(getShuffledTokens(exerciseIndex, activeSentences));
    setSelectedTokens([]);
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    audioService.playClick();
    const nextIdx = (exerciseIndex + 1) % activeSentences.length;
    resetState(nextIdx);
  };

  const handlePrev = () => {
    audioService.playClick();
    const prevIdx = (exerciseIndex - 1 + activeSentences.length) % activeSentences.length;
    resetState(prevIdx);
  };

  return (
    <div className="flex flex-col flex-1 max-w-md w-full mx-auto p-4 pb-24">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <span className="font-medium text-slate-300">
          Bài tập {exerciseIndex + 1} / {activeSentences.length}
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
          Sắp xếp trật tự câu
        </span>
      </div>

      {/* Target prompt with listening support */}
      <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 mb-4 shadow-lg shadow-black/20 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
            Câu tiếng Việt:
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-100">{currentExercise.sourceSentence}</div>
          {currentExercise.pinyin && (
            <div className="text-xs text-rose-400/90 mt-1 pinyin-text tracking-normal">
              {currentExercise.pinyin}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            audioService.playClick();
            audioService.speakChinese(currentExercise.targetSentence);
          }}
          className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all active:scale-95 shrink-0 flex items-center space-x-1.5 shadow-xs"
          title="Nghe câu mẫu tiếng Trung để vừa nghe vừa sắp xếp"
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-xs font-semibold">Nghe câu</span>
        </button>
      </div>

      {/* RESULT TILE DROP ZONE (Upper Tray) */}
      <div className="mb-4">
        <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
          <span>Khung sắp xếp câu:</span>
          {selectedTokens.length > 0 && !isCorrect && (
            <button
              onClick={handleResetCurrent}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Làm lại
            </button>
          )}
        </div>

        <div
          className={`min-h-[90px] p-3 rounded-2xl border-2 flex flex-wrap gap-2 items-center transition-colors ${
            isEvaluated
              ? isCorrect
                ? 'bg-emerald-950/20 border-emerald-500/50'
                : 'bg-rose-950/20 border-rose-500/50'
              : 'bg-slate-850 border-dashed border-slate-700'
          }`}
        >
          {selectedTokens.length === 0 ? (
            <div className="w-full text-center text-xs text-slate-500 italic select-none">
              Chạm vào các mảnh ghép bên dưới để sắp xếp vào đây
            </div>
          ) : (
            selectedTokens.map((token, idx) => (
              <button
                key={idx}
                onClick={() => handleDeselectToken(token, idx)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white font-medium text-sm shadow-md active:scale-95 transition-all flex items-center gap-1"
              >
                <span>{token}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* AVAILABLE WORD BANK (Lower Tray) */}
      <div className="mb-4">
        <div className="text-xs text-slate-400 mb-2">Ngân hàng mảnh ghép:</div>
        <div className="flex flex-wrap gap-2.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-800 min-h-[90px]">
          {availableTokens.length === 0 ? (
            <div className="w-full text-center text-xs text-slate-500 italic py-3 select-none">
              Đã đưa toàn bộ mảnh ghép lên khung sắp xếp
            </div>
          ) : (
            availableTokens.map((token, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectToken(token, idx)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium text-sm shadow-sm active:scale-95 transition-all"
              >
                {token}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Feedback & Grammar Note */}
      {isEvaluated && (
        <div
          className={`p-3.5 rounded-2xl border mb-4 animate-in fade-in duration-300 ${
            isCorrect
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center justify-between font-semibold text-sm mb-1">
            <span>{isCorrect ? 'Chính xác! Hoàn thành rất tốt.' : 'Chưa đúng, hãy thử sắp xếp lại!'}</span>
            <button
              onClick={() => audioService.speakChinese(currentExercise.targetSentence)}
              className="p-1 rounded bg-slate-800/60 hover:bg-slate-800 text-slate-300"
              title="Nghe câu hoàn chỉnh"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-slate-300 mt-1">
            Đáp án chuẩn: <span className="font-bold text-white">{currentExercise.targetSentence}</span>
          </div>
          {currentExercise.grammarNote && (
            <div className="text-xs text-slate-400 mt-1 flex items-start gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{currentExercise.grammarNote}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Check Button */}
      <button
        onClick={handleCheck}
        disabled={selectedTokens.length === 0}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg mb-3 ${
          selectedTokens.length > 0
            ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-rose-900/40 active:scale-98'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
        }`}
      >
        <Check className="w-4 h-4" />
        <span>Kiểm tra kết quả</span>
      </button>

      {/* Next / Prev navigation */}
      <div className="flex items-center justify-between text-slate-400 mt-auto">
        <button
          onClick={handlePrev}
          className="p-2 rounded-lg hover:bg-slate-800 flex items-center text-xs"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Câu trước
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-lg hover:bg-slate-800 flex items-center text-xs"
        >
          Câu tiếp theo <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
