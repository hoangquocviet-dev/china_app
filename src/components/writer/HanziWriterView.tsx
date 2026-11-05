import React, { useEffect, useRef, useState, useCallback } from 'react';
import HanziWriter from 'hanzi-writer';
import { Play, RotateCcw, HelpCircle, Volume2, CheckCircle2, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';
import bundledStrokes from '../../data/bundledStrokes.json';

interface HanziWriterViewProps {
  words: ChineseWord[];
}

export const HanziWriterView: React.FC<HanziWriterViewProps> = ({ words }) => {
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [mode, setMode] = useState<'animate' | 'guide' | 'quiz'>('guide');
  const [gridType, setGridType] = useState<'mi' | 'tian'>('mi'); // Ô Mễ (米) hoặc Ô Điền (田)
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [totalStrokes, setTotalStrokes] = useState<number>(0);
  const [currentStroke, setCurrentStroke] = useState<number>(1);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 375
  );

  useEffect(() => {
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);

  const currentWord = words[selectedWordIndex] || words[0];
  const characters = Array.from(currentWord.hanzi);
  const currentChar = characters[currentCharIndex] || characters[0];

  const initWriter = useCallback(() => {
    if (!containerRef.current || !currentChar) return;

    // Clear previous SVG
    containerRef.current.innerHTML = '';
    setIsLoading(true);
    setIsCompleted(false);
    setLoadError(false);
    setCurrentStroke(1);

    try {
      const size = Math.min(Math.max(windowWidth - 64, 220), 280);

      const writer = HanziWriter.create(containerRef.current, currentChar, {
        width: size,
        height: size,
        padding: 20,
        showOutline: mode !== 'quiz',
        strokeAnimationSpeed: 1.2,
        delayBetweenStrokes: 150,
        strokeColor: '#f43f5e', // Rose-500
        outlineColor: '#475569', // Slate-600
        drawingColor: '#38bdf8', // Sky-400
        drawingWidth: 16,
        showCharacter: false,
        charDataLoader: (char, onLoad, onError) => {
          const localData = (bundledStrokes as Record<string, any>)[char];
          if (localData) {
            onLoad(localData);
            return;
          }
          fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(char)}.json`)
            .then((res) => {
              if (!res.ok) throw new Error('Network error');
              return res.json();
            })
            .then((data) => onLoad(data))
            .catch((err) => {
              console.warn('[HanziWriter] Failed to load stroke data', err);
              if (onError) onError(err);
            });
        },
        onLoadCharDataSuccess: (data) => {
          setIsLoading(false);
          setLoadError(false);
          setTotalStrokes(data && data.strokes ? data.strokes.length : 0);
          if (mode === 'animate') {
            writer.animateCharacter();
          } else {
            startQuiz(writer, mode === 'guide');
          }
        },
        onLoadCharDataError: () => {
          setIsLoading(false);
          setLoadError(true);
        },
      });

      writerRef.current = writer;
    } catch (e) {
      console.error('Failed to init HanziWriter', e);
      setIsLoading(false);
      setLoadError(true);
    }
  }, [currentChar, mode, windowWidth]);

  const startQuiz = (writer: HanziWriter, showOutline: boolean) => {
    if (showOutline) {
      writer.showOutline();
    } else {
      writer.hideOutline();
    }
    writer.quiz({
      onMistake: () => {
        audioService.playErrorBuzz();
      },
      onCorrectStroke: (strokeData) => {
        audioService.playStrokeSuccess();
        setCurrentStroke(strokeData.strokeNum + 2);
      },
      onComplete: () => {
        audioService.playSuccessChime();
        setIsCompleted(true);
        confetti({
          particleCount: 35,
          spread: 75,
          origin: { y: 0.7 },
        });

        // Speak current character
        audioService.speakChinese(currentChar);

        // If there is another character in this word, auto advance after 1.2s
        if (currentCharIndex < characters.length - 1) {
          setTimeout(() => {
            setCurrentCharIndex((prev) => prev + 1);
          }, 1200);
        } else {
          // Completed full word! Speak full word after 700ms
          setTimeout(() => {
            audioService.speakChinese(currentWord.hanzi);
          }, 700);
        }
      },
    });
  };

  const handleNextWord = () => {
    audioService.playClick();
    setSelectedWordIndex((prev) => (prev + 1) % words.length);
    setCurrentCharIndex(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    initWriter();
    return () => {
      writerRef.current = null;
    };
  }, [initWriter]);

  const handleAnimate = () => {
    if (!writerRef.current) return;
    audioService.playClick();
    setMode('animate');
    writerRef.current.animateCharacter();
  };

  const handleReset = () => {
    audioService.playClick();
    initWriter();
  };

  const handleHint = () => {
    if (!writerRef.current) return;
    audioService.playClick();
    writerRef.current.showOutline();
  };

  const handleSpeak = () => {
    audioService.playClick();
    audioService.speakChinese(currentChar);
  };

  return (
    <div className="flex flex-col flex-1 max-w-md w-full mx-auto p-4 pb-24">
      {/* Word & Char Selectors */}
      <div className="flex items-center justify-between mb-3">
        <select
          value={selectedWordIndex}
          onChange={(e) => {
            audioService.playClick();
            setSelectedWordIndex(Number(e.target.value));
            setCurrentCharIndex(0);
          }}
          className="bg-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-rose-500 font-medium max-w-[200px]"
        >
          {words.map((w, idx) => (
            <option key={w.id} value={idx}>
              {w.hanzi} - {w.pinyin} ({w.hanviet})
            </option>
          ))}
        </select>

        {/* Character tabs if multi-char word */}
        <div className="flex items-center space-x-1.5">
          {characters.map((char, cIdx) => (
            <button
              key={cIdx}
              onClick={() => {
                audioService.playClick();
                setCurrentCharIndex(cIdx);
              }}
              className={`w-8 h-8 rounded-lg font-bold text-sm transition-all ${
                currentCharIndex === cIdx
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Info card banner */}
      <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-750 flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-slate-100">{currentChar}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase">
              {currentWord.hanviet}
            </span>
            {totalStrokes > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 font-medium">
                {totalStrokes} nét
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="text-xs text-rose-400 font-medium pinyin-text tracking-normal">{currentWord.pinyin}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">{currentWord.meaning}</span>
          </div>
        </div>
        <button
          onClick={handleSpeak}
          className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95 border border-rose-500/20"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Switches */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80 mb-4">
        <button
          onClick={() => {
            audioService.playClick();
            setMode('animate');
          }}
          className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'animate'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Xem mẫu
        </button>
        <button
          onClick={() => {
            audioService.playClick();
            setMode('guide');
          }}
          className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'guide'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Đồ nét
        </button>
        <button
          onClick={() => {
            audioService.playClick();
            setMode('quiz');
          }}
          className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'quiz'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Tự viết
        </button>
      </div>

      {/* Hanzi Canvas Container with Mễ / Điền Grid */}
      <div className="relative mx-auto rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-2xl flex items-center justify-center p-2 mb-4 w-full aspect-square max-w-[300px]">
        {/* SVG Background Grid */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none p-4"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Outer Border */}
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="none"
            stroke="#475569"
            strokeWidth="1.2"
          />

          {/* Cross (Điền tự cách) */}
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="#334155"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="#334155"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />

          {/* Diagonals (Mễ tự cách) */}
          {gridType === 'mi' && (
            <>
              <line
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                stroke="#334155"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
              <line
                x1="100"
                y1="0"
                x2="0"
                y2="100"
                stroke="#334155"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
            </>
          )}
        </svg>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs text-xs text-slate-400">
            Đang tải dữ liệu nét...
          </div>
        )}

        {/* Error Indicator with Retry */}
        {loadError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-xs text-xs text-rose-400 p-4 text-center">
            <AlertCircle className="w-6 h-6 mb-2" />
            <p className="mb-2">Chưa tải được dữ liệu nét chữ này</p>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-500 active:scale-95 transition-all"
            >
              Thử tải lại
            </button>
          </div>
        )}

        {/* The HanziWriter Canvas mount point */}
        <div
          ref={containerRef}
          className="hanzi-canvas-container relative z-10 flex items-center justify-center cursor-crosshair"
        />

        {/* Completion Overlay */}
        {isCompleted && (
          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold shadow-lg backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {currentCharIndex < characters.length - 1
                ? `Đã xong chữ [${currentChar}]! Chuyển chữ tiếp theo...`
                : 'Hoàn thành xuất sắc!'}
            </span>
          </div>
        )}
      </div>

      {/* Full Word Completion Action Card */}
      {isCompleted && currentCharIndex === characters.length - 1 && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-850 to-slate-800 border border-emerald-500/40 mb-4 animate-in fade-in duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Đã hoàn thành từ vựng!
                </div>
                <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{currentWord.hanzi}</span>
                  <span className="text-xs text-rose-400 font-normal pinyin-text">({currentWord.pinyin})</span>
                  <span className="text-xs text-slate-400 font-normal">• {currentWord.hanviet}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => audioService.speakChinese(currentWord.hanzi)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Nghe phát âm cả từ"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleReset}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Viết lại</span>
            </button>
            <button
              onClick={handleNextWord}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-900/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span>Từ tiếp theo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Grid Switch & Canvas Controls */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400 px-1">
        <div className="flex items-center space-x-2">
          <span>Khung kẻ:</span>
          <button
            onClick={() => {
              audioService.playClick();
              setGridType(gridType === 'mi' ? 'tian' : 'mi');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium"
          >
            {gridType === 'mi' ? 'Ô Mễ (米)' : 'Ô Điền (田)'}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {mode !== 'animate' && totalStrokes > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Nét {Math.min(currentStroke, totalStrokes)} / {totalStrokes}
            </span>
          )}
          <span className="text-slate-500">
            {mode === 'quiz' ? 'Tự viết từ trí nhớ' : mode === 'guide' ? 'Đồ theo nét mờ' : 'Xem thứ tự nét'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleAnimate}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 active:scale-95 transition-all text-xs font-medium"
        >
          <Play className="w-3.5 h-3.5 text-rose-400" />
          <span>Vẽ lại mẫu</span>
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 active:scale-95 transition-all text-xs font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Xóa viết lại</span>
        </button>

        <button
          onClick={handleHint}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 active:scale-95 transition-all text-xs font-medium"
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Gợi ý nét</span>
        </button>
      </div>
    </div>
  );
};
