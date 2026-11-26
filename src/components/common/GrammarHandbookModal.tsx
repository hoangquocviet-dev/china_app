import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Sparkles, Volume2, BookOpen, AlertCircle } from 'lucide-react';
import { GRAMMAR_PATTERNS, type GrammarCategory } from '../../data/grammarPatternsData';
import { audioService } from '../../utils/audio';

interface GrammarHandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrammarHandbookModal: React.FC<GrammarHandbookModalProps> = ({ isOpen, onClose }) => {
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'HSK 1' | 'HSK 2'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | GrammarCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredPatterns = useMemo(() => {
    let list = GRAMMAR_PATTERNS;

    if (selectedLevel !== 'all') {
      list = list.filter((item) => item.level === selectedLevel);
    }

    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;

    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.pattern.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q) ||
        item.tip.toLowerCase().includes(q) ||
        item.examples.some(
          (ex) =>
            ex.hanzi.includes(q) ||
            ex.pinyin.toLowerCase().includes(q) ||
            ex.meaning.toLowerCase().includes(q)
        )
    );
  }, [selectedLevel, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.playClick();
    audioService.speakChinese(text);
  };

  const categories: Array<{ id: 'all' | GrammarCategory; label: string }> = [
    { id: 'all', label: 'Tất cả' },
    { id: 'basic', label: 'Câu cơ bản' },
    { id: 'question', label: 'Câu nghi vấn' },
    { id: 'particle', label: 'Trợ từ & Phó từ' },
    { id: 'complex', label: 'Cấu trúc phức' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Sổ Tay Ngữ Pháp Trọng Điểm HSK 1 - 2</h3>
              <p className="text-[11px] text-slate-400">20 Cấu trúc cốt lõi, công thức, mẹo phân biệt & câu ví dụ</p>
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

        {/* Filters & Search */}
        <div className="p-3 bg-slate-850/70 border-b border-slate-800 space-y-2.5 shrink-0">
          {/* Level Filter Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-750 text-xs font-bold">
            <button
              data-testid="filter-grammar-level-all"
              onClick={() => {
                audioService.playClick();
                setSelectedLevel('all');
              }}
              className={`py-1.5 rounded-xl transition-all ${
                selectedLevel === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tất cả ({GRAMMAR_PATTERNS.length})
            </button>
            <button
              data-testid="filter-grammar-level-hsk1"
              onClick={() => {
                audioService.playClick();
                setSelectedLevel('HSK 1');
              }}
              className={`py-1.5 rounded-xl transition-all ${
                selectedLevel === 'HSK 1'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HSK 1 (12)
            </button>
            <button
              data-testid="filter-grammar-level-hsk2"
              onClick={() => {
                audioService.playClick();
                setSelectedLevel('HSK 2');
              }}
              className={`py-1.5 rounded-xl transition-all ${
                selectedLevel === 'HSK 2'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HSK 2 (8)
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  audioService.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition-colors border ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-750 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              data-testid="grammar-handbook-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo cấu trúc (chữ 是, 有, 比...), từ khóa ngữ pháp..."
              className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Mẹo vàng học ngữ pháp tiếng Trung:</div>
              <div className="text-[11px] opacity-90 mt-0.5">
                Tiếng Trung không chia thì (không đổi đuôi động từ). Ngữ nghĩa và thời gian được thể hiện qua trật tự từ (thời gian trước động từ), trạng ngữ địa điểm (ở đâu trước làm gì sau) và các trợ từ ngữ khí (了, 着, 过, 呢).
              </div>
            </div>
          </div>

          {filteredPatterns.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Không tìm thấy cấu trúc ngữ pháp nào khớp với &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredPatterns.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-all flex flex-col gap-2.5 shadow-xs"
              >
                {/* Header card */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-bold text-slate-100 text-sm">{item.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                        {item.level}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-750 text-slate-300 font-medium">
                        {item.categoryName}
                      </span>
                    </div>

                    {/* Formula / Pattern box */}
                    <div className="mt-1.5 p-2 rounded-xl bg-slate-900 border border-slate-750 text-amber-300 font-mono text-[11px] font-semibold">
                      {item.pattern}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  <span className="font-semibold text-slate-400">Cách dùng: </span>
                  {item.explanation}
                </p>

                {/* Tip / Pitfall */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-[11px] text-amber-300/90 border border-amber-500/20 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-400">Lưu ý quan trọng: </span>
                    <span>{item.tip}</span>
                  </div>
                </div>

                {/* Examples */}
                <div className="mt-1 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    Câu ví dụ mẫu chuẩn (Chạm nút loa để nghe):
                  </span>
                  <div className="space-y-1.5">
                    {item.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-850 border border-slate-750/70 hover:border-slate-700 flex items-center justify-between gap-2 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-100 text-xs">{ex.hanzi}</div>
                          <div className="text-[11px] text-rose-400 pinyin-text">{ex.pinyin}</div>
                          <div className="text-[11px] text-slate-400">{ex.meaning}</div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleSpeak(e, ex.hanzi)}
                          className="p-1.5 rounded-lg bg-slate-750 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors shrink-0"
                          title="Nghe phát âm câu này"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Tổng cộng 20 cấu trúc HSK 1 & HSK 2</span>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all active:scale-95"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
