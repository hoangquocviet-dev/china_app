import React, { useState } from 'react';
import { Volume2, Check, RotateCcw, ChevronLeft, ChevronRight, HelpCircle, Keyboard, Grid } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_SENTENCES } from '../../data/hsk1Sentences';
import { audioService } from '../../utils/audio';

export const TranslationView: React.FC = () => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [inputMode, setInputMode] = useState<'bank' | 'type'>('bank');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentExercise = INITIAL_SENTENCES[exerciseIndex] || INITIAL_SENTENCES[0];

  const getShuffledTokens = (exIndex: number) => {
    const ex = INITIAL_SENTENCES[exIndex];
    const all = [...ex.tokens, ...(ex.distractorTokens || [])];
    return all.sort(() => Math.random() - 0.5);
  };

  const [availableTokens, setAvailableTokens] = useState<string[]>(() =>
    getShuffledTokens(exerciseIndex)
  );
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  const resetState = (newIndex: number) => {
    setExerciseIndex(newIndex);
    setAvailableTokens(getShuffledTokens(newIndex));
    setSelectedTokens([]);
    setTypedAnswer('');
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

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[。，！？.,!?:"'“”‘’\s]/g, '')
      .trim();
  };

  const handleCheck = () => {
    let answerText = '';
    if (inputMode === 'bank') {
      // In Vietnamese join with space, in Chinese join without space
      answerText = currentExercise.targetLang === 'vi' ? selectedTokens.join(' ') : selectedTokens.join('');
    } else {
      answerText = typedAnswer;
    }

    const normAnswer = normalizeText(answerText);
    const normTarget = normalizeText(currentExercise.targetSentence);

    let matched = normAnswer === normTarget;

    // Check against acceptable answers
    if (!matched && currentExercise.acceptableAnswers) {
      matched = currentExercise.acceptableAnswers.some(
        (ans) => normalizeText(ans) === normAnswer
      );
    }

    setIsEvaluated(true);
    setIsCorrect(matched);

    if (matched) {
      audioService.playSuccessChime();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.75 },
      });
      if (currentExercise.targetLang === 'zh') {
        audioService.speakChinese(currentExercise.targetSentence);
      }
    } else {
      audioService.playErrorBuzz();
    }
  };

  const handleResetCurrent = () => {
    audioService.playClick();
    setAvailableTokens(getShuffledTokens(exerciseIndex));
    setSelectedTokens([]);
    setTypedAnswer('');
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    audioService.playClick();
    const nextIdx = (exerciseIndex + 1) % INITIAL_SENTENCES.length;
    resetState(nextIdx);
  };

  const handlePrev = () => {
    audioService.playClick();
    const prevIdx = (exerciseIndex - 1 + INITIAL_SENTENCES.length) % INITIAL_SENTENCES.length;
    resetState(prevIdx);
  };

  return (
    <div className="flex flex-col flex-1 max-w-md w-full mx-auto p-4 pb-24">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <span className="font-medium text-slate-300">
          Câu {exerciseIndex + 1} / {INITIAL_SENTENCES.length}
        </span>
        <div className="flex items-center space-x-1.5">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
            {currentExercise.sourceLang === 'zh' ? 'Dịch Trung → Việt' : 'Dịch Việt → Trung'}
          </span>
        </div>
      </div>

      {/* Mode Switcher: Word Bank vs Typing */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80 mb-3">
        <button
          onClick={() => {
            audioService.playClick();
            setInputMode('bank');
          }}
          className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            inputMode === 'bank'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Ghép thẻ từ</span>
        </button>
        <button
          onClick={() => {
            audioService.playClick();
            setInputMode('type');
          }}
          className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            inputMode === 'type'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Gõ văn bản</span>
        </button>
      </div>

      {/* Source Prompt Box */}
      <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 mb-4 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            {currentExercise.sourceLang === 'zh' ? 'Nguyên văn tiếng Trung:' : 'Câu tiếng Việt:'}
          </div>
          {currentExercise.sourceLang === 'zh' && (
            <button
              onClick={() => audioService.speakChinese(currentExercise.sourceSentence)}
              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
              title="Nghe câu"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="text-xl font-bold text-slate-100">{currentExercise.sourceSentence}</div>
        {currentExercise.pinyin && (
          <div className="text-xs text-rose-400/90 mt-1 pinyin-text tracking-normal">{currentExercise.pinyin}</div>
        )}
      </div>

      {/* INPUT AREA: Word Bank or Freeform Textarea */}
      {inputMode === 'bank' ? (
        <>
          {/* Selected Tray */}
          <div className="mb-4">
            <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
              <span>Bản dịch của bạn:</span>
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
                  Chạm vào các từ bên dưới để ghép câu dịch
                </div>
              ) : (
                selectedTokens.map((token, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDeselectToken(token, idx)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white font-medium text-sm shadow-md active:scale-95 transition-all"
                  >
                    {token}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Available Word Bank */}
          <div className="mb-4">
            <div className="text-xs text-slate-400 mb-2">Thẻ từ gợi ý:</div>
            <div className="flex flex-wrap gap-2.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-800 min-h-[90px]">
              {availableTokens.map((token, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectToken(token, idx)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium text-sm shadow-sm active:scale-95 transition-all"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Typing Mode */
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-2">Gõ câu dịch của bạn:</div>
          <textarea
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            placeholder={
              currentExercise.targetLang === 'zh'
                ? 'Nhập câu tiếng Trung (Pinyin / Chữ Hán)...'
                : 'Nhập bản dịch tiếng Việt...'
            }
            rows={3}
            className="w-full p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500"
          />
        </div>
      )}

      {/* Result Evaluation Box */}
      {isEvaluated && (
        <div
          className={`p-3.5 rounded-2xl border mb-4 animate-in fade-in duration-300 ${
            isCorrect
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="font-semibold text-sm mb-1">
            {isCorrect ? 'Dịch rất chuẩn xác!' : 'Chưa chính xác, hãy đối chiếu với đáp án:'}
          </div>
          <div className="text-xs text-slate-300 mt-1">
            Bản dịch chuẩn: <span className="font-bold text-white">{currentExercise.targetSentence}</span>
          </div>
          {currentExercise.grammarNote && (
            <div className="text-xs text-slate-400 mt-1 flex items-start gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{currentExercise.grammarNote}</span>
            </div>
          )}
        </div>
      )}

      {/* Check Button */}
      <button
        onClick={handleCheck}
        disabled={inputMode === 'bank' ? selectedTokens.length === 0 : !typedAnswer.trim()}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg mb-3 ${
          (inputMode === 'bank' ? selectedTokens.length > 0 : typedAnswer.trim())
            ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-rose-900/40 active:scale-98'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
        }`}
      >
        <Check className="w-4 h-4" />
        <span>Kiểm tra bản dịch</span>
      </button>

      {/* Prev / Next Footer */}
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
          Câu kế tiếp <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
