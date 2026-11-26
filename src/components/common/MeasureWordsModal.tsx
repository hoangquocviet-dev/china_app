import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Sparkles, Volume2 } from 'lucide-react';
import { MEASURE_WORDS } from '../../data/measureWordsData';
import { audioService } from '../../utils/audio';

interface MeasureWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeasureWordsModal: React.FC<MeasureWordsModalProps> = ({ isOpen, onClose }) => {
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'HSK 1' | 'HSK 2'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredMeasureWords = useMemo(() => {
    let list = MEASURE_WORDS;
    if (selectedLevel !== 'all') {
      list = list.filter((item) => item.level === selectedLevel);
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter(
      (item) =>
        item.hanzi.includes(q) ||
        item.pinyin.toLowerCase().includes(q) ||
        item.hanviet.toLowerCase().includes(q) ||
        item.usage.toLowerCase().includes(q) ||
        item.formula.toLowerCase().includes(q) ||
        item.examples.some(
          (ex) =>
            ex.hanzi.includes(q) ||
            ex.meaning.toLowerCase().includes(q) ||
            ex.phrase.includes(q) ||
            ex.phraseMeaning.toLowerCase().includes(q)
        )
    );
  }, [selectedLevel, searchQuery]);

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.playClick();
    audioService.speakChinese(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
              📏
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Bảng Tra Cứu Lượng Từ Tiếng Trung</h3>
              <p className="text-[11px] text-slate-400">16 Lượng từ thiết yếu chuẩn ngữ pháp HSK 1 - 2</p>
            </div>
          </div>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level Filters & Search */}
        <div className="p-3 bg-slate-850/60 border-b border-slate-800 space-y-2.5 shrink-0">
          <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-750 text-xs font-bold">
            <button
              data-testid="filter-level-all"
              onClick={() => {
                audioService.playClick();
                setSelectedLevel('all');
              }}
              className={`py-1.5 rounded-xl transition-all ${
                selectedLevel === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tất cả ({MEASURE_WORDS.length})
            </button>
            <button
              data-testid="filter-level-hsk1"
              onClick={() => {
                audioService.playClick();
                setSelectedLevel('HSK 1');
              }}
              className={`py-1.5 rounded-xl transition-all ${
                selectedLevel === 'HSK 1'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HSK 1 (10)
            </button>
            <button
              data-testid="filter-level-hsk2"
              onClick={() => {
                audioService.playClick();
                setSelectedLevel('HSK 2');
              }}
              className={`py-1.5 rounded-xl transition-all ${
                selectedLevel === 'HSK 2'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HSK 2 (6)
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              data-testid="measure-words-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo lượng từ (个, 本...), pinyin hoặc danh từ (người, sách, xe...)"
              className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Công thức vàng sử dụng lượng từ:</div>
              <div className="text-[11px] opacity-90 mt-0.5 font-mono">
                Số từ + [Lượng từ] + Danh từ (Ví dụ: 一 (1) + 本 (quyển) + 书 (sách) ➔ 一本书)
              </div>
            </div>
          </div>

          {filteredMeasureWords.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-all flex flex-col gap-2.5 shadow-xs"
            >
              {/* Header card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 text-rose-400 flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs">
                    {item.hanzi}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-bold text-slate-100 text-base">{item.hanzi}</span>
                      <span className="text-sm text-rose-400 font-semibold pinyin-text">{item.pinyin}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold uppercase">
                        {item.hanviet}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                        {item.level}
                      </span>
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-750 text-amber-300 font-mono text-[10px] font-semibold inline-block">
                      {item.formula}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleSpeak(e, item.hanzi)}
                  className="p-2 rounded-xl bg-slate-700/60 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors shrink-0"
                  title={`Nghe phát âm lượng từ ${item.hanzi}`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Usage & Tip */}
              <p className="text-[11px] text-slate-200 leading-relaxed">
                <span className="font-semibold text-slate-400">Cách dùng: </span>
                {item.usage}
              </p>

              <div className="p-2 rounded-xl bg-slate-850 text-[11px] text-slate-400 border border-slate-800">
                <span className="font-bold text-amber-400">💡 Ghi nhớ: </span>
                {item.tip}
              </div>

              {/* Examples Grid */}
              <div className="mt-1 space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Cụm từ ví dụ mẫu (Chạm để nghe phát âm):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {item.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => handleSpeak(e, ex.phrase)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 flex items-center justify-between cursor-pointer transition-all active:scale-98 group"
                    >
                      <div className="min-w-0 flex-1 mr-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-100 text-xs sm:text-sm">{ex.phrase}</span>
                          <span className="text-[10px] text-rose-400 font-medium pinyin-text">
                            ({ex.phrasePinyin})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {ex.phraseMeaning}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(e, ex.phrase)}
                        className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-rose-600 text-slate-400 group-hover:text-white transition-colors shrink-0"
                        title={`Nghe cụm từ ${ex.phrase}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredMeasureWords.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Không tìm thấy lượng từ nào phù hợp với từ khóa "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Chạm vào cụm từ để nghe phát âm cả cụm</span>
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold transition-all active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
