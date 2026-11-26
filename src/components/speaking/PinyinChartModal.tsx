import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';
import {
  PINYIN_INITIALS,
  PINYIN_FINALS,
  PINYIN_TONES,
  PINYIN_TONE_SANDHI,
  type PinyinItem,
  type ToneItem,
} from '../../data/pinyinData';
import { audioService } from '../../utils/audio';

interface PinyinChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PinyinChartModal: React.FC<PinyinChartModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'initials' | 'finals' | 'tones' | 'sandhi'>('initials');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredInitials = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return PINYIN_INITIALS;
    return PINYIN_INITIALS.filter(
      (item) =>
        item.symbol.toLowerCase().includes(q) ||
        item.vietnameseEquivalent.toLowerCase().includes(q) ||
        item.tip.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredFinals = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return PINYIN_FINALS;
    return PINYIN_FINALS.filter(
      (item) =>
        item.symbol.toLowerCase().includes(q) ||
        item.vietnameseEquivalent.toLowerCase().includes(q) ||
        item.tip.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredSandhi = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return PINYIN_TONE_SANDHI;
    return PINYIN_TONE_SANDHI.filter(
      (rule) =>
        rule.title.toLowerCase().includes(q) ||
        rule.formula.toLowerCase().includes(q) ||
        rule.category.toLowerCase().includes(q) ||
        rule.description.toLowerCase().includes(q) ||
        rule.examples.some(
          (ex) =>
            ex.hanzi.includes(q) ||
            ex.spokenPinyin.toLowerCase().includes(q) ||
            ex.meaning.toLowerCase().includes(q)
        )
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handlePlayPinyin = (e: React.MouseEvent, item: PinyinItem) => {
    e.stopPropagation();
    audioService.playClick();
    audioService.speakChinese(item.audioText);
  };

  const handlePlayTone = (e: React.MouseEvent, tone: ToneItem) => {
    e.stopPropagation();
    audioService.playClick();
    audioService.speakChinese(tone.sampleHanzi);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xs">
              Pinyin
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Bảng Phiên Âm Pinyin Chuẩn</h3>
              <p className="text-[11px] text-slate-400">Thanh mẫu, Vận mẫu, Thanh điệu & Quy tắc biến điệu</p>
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
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-750 text-xs font-bold">
            <button
              data-testid="pinyin-tab-initials"
              onClick={() => {
                audioService.playClick();
                setActiveTab('initials');
                setSearchQuery('');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'initials'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Thanh mẫu</span>
            </button>
            <button
              data-testid="pinyin-tab-finals"
              onClick={() => {
                audioService.playClick();
                setActiveTab('finals');
                setSearchQuery('');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'finals'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Vận mẫu</span>
            </button>
            <button
              data-testid="pinyin-tab-tones"
              onClick={() => {
                audioService.playClick();
                setActiveTab('tones');
                setSearchQuery('');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'tones'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Thanh điệu</span>
            </button>
            <button
              data-testid="pinyin-tab-sandhi"
              onClick={() => {
                audioService.playClick();
                setActiveTab('sandhi');
                setSearchQuery('');
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'sandhi'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Biến điệu</span>
            </button>
          </div>
        </div>

        {/* Search Bar for Initials & Finals */}
        {activeTab !== 'tones' && (
          <div className="px-4 pt-3 pb-1 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'sandhi'
                    ? 'Tìm quy tắc biến điệu (thanh 3, yī, bù, nǐ hǎo...)'
                    : `Tìm ${activeTab === 'initials' ? 'phụ âm (zh, q, b...)' : 'nguyên âm (a, ü, ang...)'} hoặc mẹo phát âm...`
                }
                className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-rose-500"
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
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
          {activeTab === 'sandhi' ? (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Quy tắc biến điệu (Tone Sandhi 🎼):</div>
                  <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                    Trong giao tiếp thực tế, người bản xứ biến đổi thanh điệu để câu nói tự nhiên, mượt mà và không mỏi cơ miệng. Chạm vào bất kỳ từ mẫu nào bên dưới để nghe phát âm chuẩn thực tế!
                  </div>
                </div>
              </div>

              {filteredSandhi.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-all flex flex-col gap-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-100 text-xs sm:text-sm">{rule.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
                          {rule.category}
                        </span>
                      </div>
                      <div className="mt-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-750 text-amber-300 font-mono text-[11px] font-bold inline-block">
                        {rule.formula}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {rule.description}
                  </p>

                  <div className="p-2 rounded-xl bg-slate-850 text-[11px] text-slate-400 border border-slate-800">
                    <span className="font-bold text-amber-400">💡 Ghi nhớ: </span>
                    {rule.tip}
                  </div>

                  {/* Interactive Word Examples */}
                  <div className="mt-1 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Từ mẫu thực hành (Chạm loa để nghe):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {rule.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            audioService.playClick();
                            audioService.speakChinese(ex.hanzi);
                          }}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all active:scale-98 group"
                        >
                          <div className="min-w-0 flex-1 mr-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-100 text-sm">{ex.hanzi}</span>
                              <span className="text-[10px] text-slate-500 line-through">
                                {ex.originalPinyin}
                              </span>
                              <span className="text-[11px] font-bold text-emerald-400 pinyin-text">
                                ➔ {ex.spokenPinyin}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {ex.meaning}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              audioService.playClick();
                              audioService.speakChinese(ex.hanzi);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-rose-600 text-slate-400 group-hover:text-white transition-colors shrink-0"
                            title={`Phát âm từ ${ex.hanzi}`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {filteredSandhi.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  Không tìm thấy quy tắc biến điệu nào khớp với từ khóa "{searchQuery}".
                </div>
              )}
            </div>
          ) : activeTab === 'tones' ? (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Hệ thống 4 thanh điệu tiếng Trung:</div>
                  <div className="text-[11px] opacity-90 mt-0.5">
                    Thanh điệu quyết định nghĩa của từ. Chạm nút loa để nghe chuẩn âm điệu ví dụ minh họa bằng chữ [妈 - 麻 - 马 - 骂].
                  </div>
                </div>
              </div>

              {PINYIN_TONES.map((tone) => (
                <div
                  key={tone.toneNumber}
                  className="p-3 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold text-lg pinyin-text">
                        {tone.symbol}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{tone.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700/80 text-slate-300 font-mono">
                            Độ cao: {tone.contour}
                          </span>
                        </div>
                        <div className="text-[11px] text-rose-400 font-medium mt-0.5">
                          {tone.vietnameseEquivalent}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handlePlayTone(e, tone)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shadow-rose-900/30"
                      title="Nghe phát âm từ mẫu"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{tone.samplePinyin} ({tone.sampleHanzi})</span>
                    </button>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-850/80 text-[11px] text-slate-300 border border-slate-800 leading-relaxed">
                    <span className="font-semibold text-amber-400">Mẹo tạo âm: </span>
                    {tone.tip}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {(activeTab === 'initials' ? filteredInitials : filteredFinals).map((item) => {
                const isExpanded = expandedSymbol === item.symbol;
                return (
                  <div
                    key={item.symbol}
                    onClick={() => setExpandedSymbol(isExpanded ? null : item.symbol)}
                    className="p-3 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 cursor-pointer transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-slate-850 border border-slate-700 text-rose-400 flex items-center justify-center font-bold text-base pinyin-text shrink-0 shadow-xs">
                          {item.symbol}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="font-bold text-slate-100">{item.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-400">
                              {item.group}
                            </span>
                          </div>
                          <div className="text-[11px] text-rose-400 font-medium truncate mt-0.5">
                            {item.vietnameseEquivalent}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handlePlayPinyin(e, item)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all active:scale-95"
                          title="Nghe phát âm chuẩn"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <div className="text-slate-500 p-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-750/80 text-[11px] space-y-2 animate-fadeIn">
                        <div className="p-2 rounded-xl bg-slate-850 text-slate-300 leading-relaxed border border-slate-800">
                          <span className="font-bold text-amber-400">Khẩu hình & mẹo: </span>
                          {item.tip}
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-100">
                              Từ mẫu: [{item.exampleHanzi}]
                            </span>
                            <span className="text-rose-400 font-medium pinyin-text">
                              {item.examplePinyin}
                            </span>
                            <span className="text-slate-400">• {item.exampleMeaning}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              audioService.playClick();
                              audioService.speakChinese(item.exampleHanzi);
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-rose-300 border border-slate-750 text-[10px] font-semibold flex items-center gap-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Nghe từ</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {(activeTab === 'initials' ? filteredInitials : filteredFinals).length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  Không tìm thấy âm nào khớp với từ khóa "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chạm vào âm để nghe & xem hướng dẫn</span>
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
