import React, { useState, useEffect } from 'react';
import { Volume2, Eye, EyeOff, Check, RotateCcw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';

interface FlashcardViewProps {
  words: ChineseWord[];
  onUpdateWordSRS: (wordId: string, isCorrect: boolean) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ words, onUpdateWordSRS }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hidePinyin, setHidePinyin] = useState(false);
  const [hideHanviet, setHideHanviet] = useState(false);

  if (!words || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <p className="text-slate-400">Chưa có từ vựng nào trong danh sách.</p>
      </div>
    );
  }

  const currentWord = words[currentIndex] || words[0];

  const handleFlip = () => {
    audioService.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.playClick();
    audioService.speakChinese(text);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const handleAnswer = (isCorrect: boolean) => {
    audioService.stopSpeech();
    if (isCorrect) {
      audioService.playSuccessChime();
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
      });
    } else {
      audioService.playErrorBuzz();
    }

    onUpdateWordSRS(currentWord.id, isCorrect);
    handleNext();
  };

  useEffect(() => {
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
  }, [currentIndex, isFlipped, words]);

  return (
    <div className="flex flex-col flex-1 max-w-md w-full mx-auto p-4 pb-24">
      {/* Top Controls: Progress & Peek Mask Toggles */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-slate-300">
            {currentIndex + 1} / {words.length}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Hộp SRS {currentWord.box || 1}
          </span>
        </div>

        {/* Peek Mask Toggles */}
        <div className="flex items-center space-x-2">
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

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* 3D Flashcard Container */}
      <div
        onClick={handleFlip}
        className="relative w-full aspect-[4/5] min-h-[350px] max-h-[460px] perspective-1000 cursor-pointer select-none"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-3xl ${
            isFlipped ? 'rotate-x-180' : ''
          }`}
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 p-6 flex flex-col justify-between shadow-2xl shadow-black/40">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {currentWord.pos}
              </span>
              <button
                onClick={(e) => handleSpeak(e, currentWord.hanzi)}
                className="p-2.5 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-95"
                title="Nghe phát âm"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Central Hanzi Display */}
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="text-6xl font-bold text-slate-100 tracking-wider mb-3 select-all">
                {currentWord.hanzi}
              </div>

              {/* Pinyin (Maskable) */}
              <div className="mb-2">
                {hidePinyin ? (
                  <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-500 text-sm italic border border-slate-700/50">
                    (Pinyin ẩn - Chạm để lật)
                  </span>
                ) : (
                  <span className="text-xl font-medium text-rose-400 pinyin-text tracking-normal">
                    {currentWord.pinyin}
                  </span>
                )}
              </div>

              {/* Hán Việt (Maskable) */}
              <div>
                {hideHanviet ? (
                  <span className="px-2 py-0.5 text-xs text-slate-500 italic">
                    [Âm Hán Việt ẩn]
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-widest">
                    {currentWord.hanviet}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom hint */}
            <div className="text-center text-xs text-slate-500">
              Chạm vào thẻ để xem nghĩa chi tiết và câu ví dụ
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-x-180 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-rose-500/30 p-6 flex flex-col justify-between shadow-2xl shadow-black/40 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-100">{currentWord.hanzi}</span>
                  <span className="text-sm text-rose-400 font-medium pinyin-text tracking-normal">{currentWord.pinyin}</span>
                </div>
                <button
                  onClick={(e) => handleSpeak(e, currentWord.hanzi)}
                  className="p-2 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Hán Việt & Nghĩa */}
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
                  Âm Hán Việt: {currentWord.hanviet}
                </div>
                <div className="text-lg font-medium text-slate-100">{currentWord.meaning}</div>
                {currentWord.radical && (
                  <div className="mt-1 text-xs text-slate-400">
                    Bộ thủ: <span className="text-slate-200">{currentWord.radical}</span>
                    {currentWord.strokeCount && ` (${currentWord.strokeCount} nét)`}
                  </div>
                )}
              </div>

              {/* Examples */}
              {currentWord.examples && currentWord.examples.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-rose-400" /> Câu ví dụ:
                  </div>
                  <div className="space-y-2">
                    {currentWord.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => handleSpeak(e, ex.zh)}
                        className="p-2 rounded-lg bg-slate-800/60 border border-slate-750 hover:border-slate-700 transition-colors cursor-pointer"
                      >
                        <div className="text-sm font-medium text-slate-200 flex items-center justify-between">
                          <span>{ex.zh}</span>
                          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div className="text-xs text-rose-400/90 pinyin-text tracking-normal">{ex.pinyin}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{ex.vi}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-xs text-slate-500 pt-2">
              Chạm thẻ để quay lại mặt trước
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
    </div>
  );
};
