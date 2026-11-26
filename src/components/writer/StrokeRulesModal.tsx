import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Sparkles, Edit3, BookOpen } from 'lucide-react';
import {
  BASIC_STROKES,
  STROKE_ORDER_RULES,
} from '../../data/strokeRulesData';
import { audioService } from '../../utils/audio';

interface StrokeRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (hanzi: string) => void;
}

export const StrokeRulesModal: React.FC<StrokeRulesModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'strokes'>('rules');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredRules = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return STROKE_ORDER_RULES;
    return STROKE_ORDER_RULES.filter(
      (rule) =>
        rule.title.toLowerCase().includes(q) ||
        rule.chineseTitle.includes(q) ||
        rule.pinyinTitle.toLowerCase().includes(q) ||
        rule.principle.toLowerCase().includes(q) ||
        rule.explanation.toLowerCase().includes(q) ||
        rule.examples.some((ex) => ex.hanzi.includes(q) || ex.meaning.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredStrokes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return BASIC_STROKES;
    return BASIC_STROKES.filter(
      (stroke) =>
        stroke.name.toLowerCase().includes(q) ||
        stroke.chineseName.includes(q) ||
        stroke.pinyin.toLowerCase().includes(q) ||
        stroke.description.toLowerCase().includes(q) ||
        stroke.examples.some((ex) => ex.hanzi.includes(q) || ex.meaning.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handlePickCharacter = (e: React.MouseEvent, hanzi: string) => {
    e.stopPropagation();
    audioService.playClick();
    audioService.speakChinese(hanzi);
    if (onSelectCharacter) {
      onSelectCharacter(hanzi);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
              ✍️
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Bút Thuận & Các Nét Cơ Bản</h3>
              <p className="text-[11px] text-slate-400">7 Quy tắc viết chữ Hán kinh điển & 8 nét chuẩn</p>
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

        {/* Navigation Tabs */}
        <div className="p-3 bg-slate-850/60 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-750 text-xs font-bold">
            <button
              data-testid="tab-stroke-rules"
              onClick={() => {
                audioService.playClick();
                setActiveTab('rules');
                setSearchQuery('');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'rules'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>7 Quy tắc bút thuận</span>
            </button>
            <button
              data-testid="tab-basic-strokes"
              onClick={() => {
                audioService.playClick();
                setActiveTab('strokes');
                setSearchQuery('');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'strokes'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>8 Nét cơ bản & biến thể</span>
            </button>
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
              placeholder={
                activeTab === 'rules'
                  ? 'Tìm quy tắc (ngang trước, phẩy trước, vào trước, 十, 人...)'
                  : 'Tìm nét (nét ngang, nét sổ, phẩy, mác, 一, 丨...)'
              }
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
          {activeTab === 'rules' ? (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Quy tắc vàng viết chữ Hán:</div>
                  <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                    Viết đúng bút thuận giúp nét chữ vuông vức, cân đối và tốc độ viết nhanh hơn gấp 2 lần. Chạm nút <strong>Tập viết</strong> ở bất kỳ từ nào để nạp trực tiếp vào bàn vẽ!
                  </div>
                </div>
              </div>

              {filteredRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-all flex flex-col gap-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          {rule.ruleNumber}
                        </span>
                        <h4 className="font-bold text-slate-100 text-sm">{rule.title}</h4>
                        <span className="text-[11px] text-indigo-400 font-medium">
                          {rule.chineseTitle} ({rule.pinyinTitle})
                        </span>
                      </div>
                      <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-750 text-amber-300 font-semibold text-[11px] inline-block">
                        ★ {rule.principle}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {rule.explanation}
                  </p>

                  <div className="p-2 rounded-xl bg-slate-850 text-[11px] text-slate-400 border border-slate-800">
                    <span className="font-bold text-amber-400">💡 Mẹo ghi nhớ: </span>
                    {rule.tip}
                  </div>

                  {/* Character Examples */}
                  <div className="mt-1 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Chữ tiêu biểu áp dụng quy tắc (Chạm để tập viết):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {rule.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => handlePickCharacter(e, ex.hanzi)}
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between cursor-pointer transition-all active:scale-98 group"
                        >
                          <div className="min-w-0 flex-1 mr-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-100 text-base">{ex.hanzi}</span>
                              <span className="text-xs text-rose-400 font-medium pinyin-text">
                                {ex.pinyin}
                              </span>
                              <span className="text-[10px] text-slate-400">• {ex.meaning}</span>
                            </div>
                            <div className="text-[10px] text-emerald-400 truncate mt-0.5 font-medium">
                              {ex.breakdown}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handlePickCharacter(e, ex.hanzi)}
                            className="px-2 py-1 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white transition-colors text-[10px] font-bold flex items-center gap-1 shrink-0"
                            title={`Tập viết chữ ${ex.hanzi} trên bàn vẽ`}
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Viết</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {filteredRules.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  Không tìm thấy quy tắc nào khớp với từ khóa "{searchQuery}".
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">8 Nét gốc cấu tạo chữ Hán (Vĩnh Tự Bát Pháp):</div>
                  <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                    Mọi chữ Hán phức tạp đều cấu thành từ 8 nét cơ bản này. Nắm chắc cách đi bút từng nét sẽ giúp nét viết thanh thoát, có hồn.
                  </div>
                </div>
              </div>

              {filteredStrokes.map((stroke) => (
                <div
                  key={stroke.id}
                  className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-all flex flex-col gap-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 text-rose-400 flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs">
                        {stroke.symbol}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-100 text-sm">{stroke.name}</h4>
                          <span className="text-xs text-amber-300 font-bold">
                            {stroke.chineseName} ({stroke.pinyin})
                          </span>
                        </div>
                        <div className="text-[11px] text-indigo-400 font-medium mt-0.5">
                          {stroke.direction}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {stroke.description}
                  </p>

                  <div className="p-2 rounded-xl bg-slate-850 text-[11px] text-slate-400 border border-slate-800">
                    <span className="font-bold text-amber-400">💡 Mẹo tạo nét: </span>
                    {stroke.tip}
                  </div>

                  {/* Examples */}
                  <div className="mt-1 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Chữ ví dụ chứa nét này (Chạm để tập viết):
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {stroke.examples.map((ex, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => handlePickCharacter(e, ex.hanzi)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 flex items-center gap-1.5 transition-all active:scale-95 text-xs group"
                          title={`Tập viết chữ ${ex.hanzi} (${ex.meaning})`}
                        >
                          <span className="font-bold text-slate-100 text-sm group-hover:text-indigo-300">
                            {ex.hanzi}
                          </span>
                          <span className="text-[10px] text-slate-400">{ex.meaning}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {filteredStrokes.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  Không tìm thấy nét nào khớp với từ khóa "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Chạm vào bất kỳ chữ nào để nạp vào bàn vẽ</span>
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
