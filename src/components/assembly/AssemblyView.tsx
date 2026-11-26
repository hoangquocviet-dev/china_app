import React, { useState, useEffect } from 'react';
import { Volume2, Check, RotateCcw, ChevronLeft, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_SENTENCES } from '../../data/hsk1Sentences';
import type { SentenceExercise } from '../../types';
import { audioService } from '../../utils/audio';
import { storageService } from '../../utils/storage';
import { MeasureWordsModal } from '../common/MeasureWordsModal';
import { GrammarHandbookModal } from '../common/GrammarHandbookModal';
import { ConnectorsModal } from '../common/ConnectorsModal';
import { ReduplicationModal } from '../common/ReduplicationModal';
import { ComplementsModal } from '../common/ComplementsModal';
import { BaBeiModal } from '../common/BaBeiModal';
import { ComparativesModal } from '../common/ComparativesModal';
import { SpatialModal } from '../common/SpatialModal';
import { QuestionsModal } from '../common/QuestionsModal';

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
  const [showGrammarHint, setShowGrammarHint] = useState(false);
  const [isMeasureWordsOpen, setIsMeasureWordsOpen] = useState(false);
  const [isGrammarHandbookOpen, setIsGrammarHandbookOpen] = useState(false);
  const [isConnectorsOpen, setIsConnectorsOpen] = useState(false);
  const [isReduplicationOpen, setIsReduplicationOpen] = useState(false);
  const [isComplementsOpen, setIsComplementsOpen] = useState(false);
  const [isBaBeiOpen, setIsBaBeiOpen] = useState(false);
  const [isComparativesOpen, setIsComparativesOpen] = useState(false);
  const [isSpatialOpen, setIsSpatialOpen] = useState(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);

  useEffect(() => {
    setExerciseIndex(0);
    setAvailableTokens(getShuffledTokens(0, activeSentences));
    setSelectedTokens([]);
    setIsEvaluated(false);
    setIsCorrect(false);
    setShowGrammarHint(false);
  }, [sentences]);

  const currentExercise = activeSentences[exerciseIndex] || activeSentences[0];

  const resetState = (newIndex: number) => {
    setExerciseIndex(newIndex);
    setAvailableTokens(getShuffledTokens(newIndex, activeSentences));
    setSelectedTokens([]);
    setIsEvaluated(false);
    setIsCorrect(false);
    setShowGrammarHint(false);
  };

  const handleSelectToken = (token: string, tokenIndex: number) => {
    if (isEvaluated && isCorrect) return;
    audioService.playClick();
    try {
      navigator.vibrate?.(12);
    } catch {}
    // Phát âm chữ Hán khi chọn mảnh ghép để vừa ghép vừa học phát âm
    if (/[\u3400-\u9fff]/.test(token)) {
      audioService.speakChinese(token);
    }
    setSelectedTokens((prev) => [...prev, token]);
    setAvailableTokens((prev) => prev.filter((_, idx) => idx !== tokenIndex));
  };

  const handleDeselectToken = (token: string, tokenIndex: number) => {
    if (isEvaluated && isCorrect) return;
    audioService.playClick();
    try {
      navigator.vibrate?.(10);
    } catch {}
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
      storageService.recordStudyActivity();
      try {
        navigator.vibrate?.([20, 30, 20]);
      } catch {}
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
      try {
        navigator.vibrate?.([40, 30, 40]);
      } catch {}
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
      <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
        <span className="font-medium text-slate-300">
          Bài tập {exerciseIndex + 1} / {activeSentences.length}
        </span>
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            data-testid="assembly-grammar-handbook-btn"
            onClick={() => {
              audioService.playClick();
              setIsGrammarHandbookOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 hover:text-blue-200 border border-blue-500/20 font-medium transition-colors"
            title="Sổ tay 20 cấu trúc ngữ pháp trọng điểm HSK 1 - 2"
          >
            <span>📘 Ngữ pháp</span>
          </button>
          <button
            type="button"
            data-testid="assembly-measure-words-btn"
            onClick={() => {
              audioService.playClick();
              setIsMeasureWordsOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 font-medium transition-colors"
            title="Tra cứu lượng từ chuẩn ngữ pháp HSK 1 - 2"
          >
            <span>📏 Lượng từ</span>
          </button>
          <button
            type="button"
            data-testid="assembly-connectors-btn"
            onClick={() => {
              audioService.playClick();
              setIsConnectorsOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 hover:text-purple-200 border border-purple-500/20 font-medium transition-colors"
            title="Kho 18 cặp liên từ nối câu kinh điển HSK 1 - 3"
          >
            <span>🔗 Liên từ</span>
          </button>
          <button
            type="button"
            data-testid="assembly-reduplication-btn"
            onClick={() => {
              audioService.playClick();
              setIsReduplicationOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 hover:text-emerald-200 border border-emerald-500/20 font-medium transition-colors"
            title="Bí kíp trùng điệp từ & từ láy HSK (AA, ABAB, AAB, AABB)"
          >
            <span>✨ Trùng điệp</span>
          </button>
          <button
            type="button"
            data-testid="assembly-complements-btn"
            onClick={() => {
              audioService.playClick();
              setIsComplementsOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 hover:text-cyan-200 border border-cyan-500/20 font-medium transition-colors"
            title="Kho 4 dạng bổ ngữ trọng yếu HSK 1 - 3 (Kết quả, Xu hướng, Khả năng, Trạng thái)"
          >
            <span>🎯 Bổ ngữ</span>
          </button>
          <button
            type="button"
            data-testid="assembly-babei-btn"
            onClick={() => {
              audioService.playClick();
              setIsBaBeiOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 hover:text-rose-200 border border-rose-500/20 font-medium transition-colors"
            title="Bí kíp câu chữ 把 & câu chữ 被 HSK 2 - 3 (Câu xử lý & Bị động)"
          >
            <span>🛡️ 把·被</span>
          </button>
          <button
            type="button"
            data-testid="assembly-comparatives-btn"
            onClick={() => {
              audioService.playClick();
              setIsComparativesOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 hover:text-sky-200 border border-sky-500/20 font-medium transition-colors"
            title="Bí kíp câu so sánh HSK (比, 没有, 一样, 最, 越来越)"
          >
            <span>⚖️ So sánh</span>
          </button>
          <button
            type="button"
            data-testid="assembly-spatial-btn"
            onClick={() => {
              audioService.playClick();
              setIsSpatialOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 hover:text-teal-200 border border-teal-500/20 font-medium transition-colors"
            title="Phương vị từ & Câu tồn hiện HSK 2 - 3 (方位词与存现句)"
          >
            <span>🧭 Vị trí</span>
          </button>
          <button
            type="button"
            data-testid="assembly-questions-btn"
            onClick={() => {
              audioService.playClick();
              setIsQuestionsOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 font-medium transition-colors"
            title="Bảo điển câu hỏi & đại từ nghi vấn HSK (疑问句)"
          >
            <span>❓ Câu hỏi</span>
          </button>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
            Sắp xếp câu
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((exerciseIndex + 1) / activeSentences.length) * 100}%` }}
        />
      </div>

      {/* Target prompt with listening support */}
      <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 mb-4 shadow-lg shadow-black/20 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
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

        {/* Grammar Structure Hint Toggle */}
        {currentExercise.grammarNote && (
          <div className="mt-1 pt-2 border-t border-slate-750/80">
            <button
              type="button"
              data-testid="toggle-grammar-hint-btn"
              onClick={() => {
                audioService.playClick();
                setShowGrammarHint(!showGrammarHint);
              }}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showGrammarHint ? 'Ẩn cấu trúc gợi ý' : '💡 Xem cấu trúc ngữ pháp'}</span>
            </button>

            {showGrammarHint && (
              <div
                data-testid="grammar-hint-content"
                className="mt-1.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-1.5 animate-fadeIn"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentExercise.grammarNote}</span>
              </div>
            )}
          </div>
        )}
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

      {/* Action Check or Next Button */}
      {isEvaluated && isCorrect ? (
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white active:scale-98"
        >
          <span>Câu tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
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
      )}

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

      {/* 16 Essential Measure Words Modal */}
      <MeasureWordsModal
        isOpen={isMeasureWordsOpen}
        onClose={() => setIsMeasureWordsOpen(false)}
      />

      {/* 20 Core Grammar Patterns Handbook Modal */}
      <GrammarHandbookModal
        isOpen={isGrammarHandbookOpen}
        onClose={() => setIsGrammarHandbookOpen(false)}
      />

      {/* 18 Chinese Connectors & Conjunctions Modal */}
      <ConnectorsModal
        isOpen={isConnectorsOpen}
        onClose={() => setIsConnectorsOpen(false)}
      />

      {/* Chinese Reduplication Master Modal */}
      <ReduplicationModal
        isOpen={isReduplicationOpen}
        onClose={() => setIsReduplicationOpen(false)}
      />

      {/* Chinese Complements Master Modal */}
      <ComplementsModal
        isOpen={isComplementsOpen}
        onClose={() => setIsComplementsOpen(false)}
      />

      {/* Chinese BA & BEI Sentences Modal */}
      <BaBeiModal
        isOpen={isBaBeiOpen}
        onClose={() => setIsBaBeiOpen(false)}
      />

      {/* Chinese Comparative Sentences Modal */}
      <ComparativesModal
        isOpen={isComparativesOpen}
        onClose={() => setIsComparativesOpen(false)}
      />

      {/* Spatial Position & Existential Sentences Modal */}
      <SpatialModal
        isOpen={isSpatialOpen}
        onClose={() => setIsSpatialOpen(false)}
      />

      {/* Chinese Questions & Interrogative Pronouns Modal */}
      <QuestionsModal
        isOpen={isQuestionsOpen}
        onClose={() => setIsQuestionsOpen(false)}
      />
    </div>
  );
};
