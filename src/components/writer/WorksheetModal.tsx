import React, { useState } from 'react';
import { X, Printer, FileText } from 'lucide-react';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';

interface WorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWord: ChineseWord;
  words: ChineseWord[];
}

export const WorksheetModal: React.FC<WorksheetModalProps> = ({
  isOpen,
  onClose,
  currentWord,
  words,
}) => {
  const [scope, setScope] = useState<'single' | 'deck'>('single');
  const [gridStyle, setGridStyle] = useState<'mi' | 'tian'>('mi');

  if (!isOpen) return null;

  // Words to render on the worksheet
  const selectedWords = scope === 'single' ? [currentWord] : words.slice(0, 10);

  // Extract CJK characters for the selected words
  const worksheetItems: Array<{
    char: string;
    word: ChineseWord;
    charIndex: number;
  }> = [];

  selectedWords.forEach((word) => {
    const chars = Array.from(word.hanzi).filter((ch) => /[\u3400-\u9fff]/.test(ch));
    const validChars = chars.length > 0 ? chars : Array.from(word.hanzi.trim());
    validChars.forEach((char, idx) => {
      worksheetItems.push({
        char,
        word,
        charIndex: idx,
      });
    });
  });

  const handlePrint = () => {
    audioService.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl h-[94dvh] max-h-[94dvh] flex flex-col rounded-3xl bg-slate-900 border border-slate-750 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Hidden on Print) */}
        <div className="print:hidden flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-800 bg-slate-850/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span>Bảng Tập Viết Chữ Hán Khổ A4</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Printable
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                In ra giấy hoặc xuất PDF luyện viết chữ Hán theo chuẩn Ô Mễ (米字格)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors touch-manipulation active:scale-90 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Toolbar (Hidden on Print) */}
        <div className="print:hidden px-3 sm:px-5 py-2.5 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Nội dung:</span>
            <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700">
              <button
                onClick={() => {
                  audioService.playClick();
                  setScope('single');
                }}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg font-semibold transition-all touch-manipulation active:scale-95 ${
                  scope === 'single'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Từ này ({currentWord.hanzi})
              </button>
              <button
                onClick={() => {
                  audioService.playClick();
                  setScope('deck');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  scope === 'deck'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cả bài ({Math.min(words.length, 10)} từ)
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Khung ô:</span>
            <div className="inline-flex rounded-xl bg-slate-800 p-0.5 border border-slate-700">
              <button
                onClick={() => {
                  audioService.playClick();
                  setGridStyle('mi');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  gridStyle === 'mi'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ô Mễ (米)
              </button>
              <button
                onClick={() => {
                  audioService.playClick();
                  setGridStyle('tian');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  gridStyle === 'tian'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ô Điền (田)
              </button>
            </div>
          </div>

          <button
            data-testid="print-worksheet-btn"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold shadow-md shadow-rose-900/30 active:scale-95 transition-all ml-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In / Lưu PDF</span>
          </button>
        </div>

        {/* Live A4 Worksheet Preview (The printable area) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex justify-center">
          <div
            id="printable-hanzi-worksheet"
            className="w-full max-w-[560px] bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 print:max-w-none print:w-full print:border-none print:p-0 print:shadow-none print:rounded-none select-none font-sans"
          >
            {/* Sheet Title Bar */}
            <div className="flex items-center justify-between border-b-2 border-rose-600 pb-2 mb-4">
              <div>
                <h1 className="text-base sm:text-lg font-black text-rose-800 tracking-wide">
                  HANZIFLOW (汉字流) • BẢNG TẬP VIẾT CHỮ HÁN
                </h1>
                <p className="text-[10px] text-slate-500 font-medium">
                  HSK 1 Chuẩn Quốc Tế • Luyện viết nét bút theo thứ tự chuẩn
                </p>
              </div>
              <div className="text-right text-[10px] text-slate-600 space-y-0.5">
                <div>Họ & Tên: .......................................</div>
                <div>Ngày: ___/___/2026 • Điểm: _____</div>
              </div>
            </div>

            {/* Grid Table of Characters */}
            <div className="space-y-3.5">
              {worksheetItems.map((item, idx) => (
                <div
                  key={`${item.word.id}_${item.char}_${idx}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 border-b border-dashed border-slate-200 pb-3"
                >
                  {/* Left Word Meta Pill */}
                  <div className="w-full sm:w-28 shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-start pr-2">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-xl font-bold text-slate-900">{item.word.hanzi}</span>
                      <span className="text-xs font-semibold text-rose-700">{item.word.pinyin}</span>
                    </div>
                    {item.word.hanviet && (
                      <div className="text-[10px] uppercase font-bold text-amber-700">
                        {item.word.hanviet}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-600 line-clamp-1 italic">
                      {item.word.meaning}
                    </div>
                  </div>

                  {/* Practice Boxes Row */}
                  <div className="flex-1 flex items-center justify-between gap-1 overflow-x-auto py-1">
                    {/* Box 0: Bold Master Sample */}
                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 border border-rose-700 flex items-center justify-center bg-rose-50/50">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                        <line x1="50" y1="0" x2="50" y2="100" stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="3 3" />
                        <line x1="0" y1="50" x2="100" y2="50" stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="3 3" />
                        {gridStyle === 'mi' && (
                          <>
                            <line x1="0" y1="0" x2="100" y2="100" stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="3 3" />
                            <line x1="100" y1="0" x2="0" y2="100" stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="3 3" />
                          </>
                        )}
                      </svg>
                      <span className="relative z-10 text-2xl font-black text-slate-950 font-serif">
                        {item.char}
                      </span>
                    </div>

                    {/* Box 1 & 2: Watermark outline for tracing */}
                    {[1, 2].map((boxIdx) => (
                      <div
                        key={boxIdx}
                        className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 border border-slate-300 flex items-center justify-center bg-white"
                      >
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                          <line x1="50" y1="0" x2="50" y2="100" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
                          <line x1="0" y1="50" x2="100" y2="50" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
                          {gridStyle === 'mi' && (
                            <>
                              <line x1="0" y1="0" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
                              <line x1="100" y1="0" x2="0" y2="100" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
                            </>
                          )}
                        </svg>
                        <span className="relative z-10 text-2xl font-light text-slate-350 font-serif opacity-35 select-none">
                          {item.char}
                        </span>
                      </div>
                    ))}

                    {/* Box 3 to 7: Blank practice boxes */}
                    {[3, 4, 5, 6, 7].map((boxIdx) => (
                      <div
                        key={boxIdx}
                        className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 border border-slate-300 flex items-center justify-center bg-white"
                      >
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                          <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
                          <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
                          {gridStyle === 'mi' && (
                            <>
                              <line x1="0" y1="0" x2="100" y2="100" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
                              <line x1="100" y1="0" x2="0" y2="100" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
                            </>
                          )}
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Sheet Footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400">
              <span>https://chinaapp.vercel.app • HanziFlow PWA</span>
              <span>Trang 1 / 1 • Giấy A4 Chuẩn Ô Mễ (米字格)</span>
            </div>
          </div>
        </div>

        {/* Footer (Hidden on Print) */}
        <div className="print:hidden px-5 py-3 border-t border-slate-800 bg-slate-850 flex items-center justify-between text-xs text-slate-400">
          <span>Gợi ý: Nhấn Ctrl+P hoặc nút "In / Lưu PDF" để in ra máy in hoặc lưu file PDF</span>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
