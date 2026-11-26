import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  Volume2,
  PenTool,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from 'lucide-react';
import {
  COMMON_RADICALS,
  RADICAL_CATEGORIES,
} from '../../data/radicalsData';
import { audioService } from '../../utils/audio';

interface RadicalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
}

export const RadicalsModal: React.FC<RadicalsModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRadicalId, setExpandedRadicalId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredRadicals = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return COMMON_RADICALS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        item.radical.includes(q) ||
        (item.originalForm && item.originalForm.includes(q)) ||
        item.pinyin.toLowerCase().includes(q) ||
        item.hanviet.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.commonExamples.some(
          (ex) =>
            ex.hanzi.includes(q) ||
            ex.pinyin.toLowerCase().includes(q) ||
            ex.meaning.toLowerCase().includes(q)
        )
      );
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
              🏮
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Khám Phá Bộ Thủ Chữ Hán</h3>
              <p className="text-[11px] text-slate-400">
                Gốc rễ cấu tạo chữ Hán & phân tích ý nghĩa biểu trưng
              </p>
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

        {/* Category Filter Chips */}
        <div className="p-3 bg-slate-850/60 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs select-none scrollbar-none">
            <button
              onClick={() => {
                audioService.playClick();
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-750'
              }`}
            >
              Tất cả ({COMMON_RADICALS.length})
            </button>
            {Object.entries(RADICAL_CATEGORIES).map(([catKey, catLabel]) => {
              const count = COMMON_RADICALS.filter((r) => r.category === catKey).length;
              return (
                <button
                  key={catKey}
                  onClick={() => {
                    audioService.playClick();
                    setSelectedCategory(catKey);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === catKey
                      ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-750'
                  }`}
                >
                  {catLabel} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bộ thủ (氵, thủy, nước), nghĩa, hoặc chữ ví dụ..."
              className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500"
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
        <div className="p-4 flex-1 overflow-y-auto space-y-2.5 text-xs">
          {filteredRadicals.map((item) => {
            const isExpanded = expandedRadicalId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setExpandedRadicalId(isExpanded ? null : item.id)}
                className="p-3 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {/* Big Radical Symbol Badge */}
                    <div className="w-11 h-11 rounded-2xl bg-slate-850 border border-slate-700 text-amber-400 flex flex-col items-center justify-center font-bold text-lg select-all shrink-0 shadow-xs">
                      <span>{item.radical}</span>
                      {item.originalForm && item.originalForm !== item.radical && (
                        <span className="text-[9px] text-slate-400 font-normal -mt-1">
                          ({item.originalForm})
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-bold text-slate-100 text-sm">
                          Bộ {item.hanviet}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold pinyin-text">
                          {item.pinyin}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700/60 text-slate-400">
                          {item.strokeCount} nét
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                        {item.meaning}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-500 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        audioService.playClick();
                        audioService.speakChinese(item.originalForm || item.radical);
                      }}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all active:scale-95"
                      title="Nghe phát âm bộ thủ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div className="p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-slate-750 text-[11px] space-y-2.5 animate-fadeIn">
                    <div className="p-2.5 rounded-xl bg-slate-850/90 border border-slate-800 text-slate-300 leading-relaxed">
                      <span className="font-bold text-amber-400">Ý nghĩa: </span>
                      {item.meaning}.
                    </div>

                    <div>
                      <div className="text-slate-400 font-semibold mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Các chữ Hán tiêu biểu chứa bộ [{item.radical}]:</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {item.commonExamples.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-1.5"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-sm text-slate-100">
                                  {ex.hanzi}
                                </span>
                                <span className="text-rose-400 text-[10px] pinyin-text font-medium">
                                  ({ex.pinyin})
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {ex.meaning}
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  audioService.playClick();
                                  audioService.speakChinese(ex.hanzi);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 transition-colors"
                                title="Nghe phát âm"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              {onSelectCharacter && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    audioService.playClick();
                                    onSelectCharacter(ex.hanzi);
                                    onClose();
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                                  title="Luyện viết chữ này"
                                >
                                  <PenTool className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredRadicals.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Không tìm thấy bộ thủ nào khớp với từ khóa "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Chạm chữ ví dụ để nghe hoặc luyện viết</span>
          </span>
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
