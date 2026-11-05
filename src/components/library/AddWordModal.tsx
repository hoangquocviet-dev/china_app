import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Check, Volume2, Sparkles, BookOpen, PenLine, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { DICTIONARY_WORDS } from '../../data/dictionaryData';
import { audioService } from '../../utils/audio';
import { storageService } from '../../utils/storage';
import { autoGenerateWordFromVietnamese } from '../../utils/vietnameseAutoGenerator';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedWords: ChineseWord[];
  onWordAdded: (newWord: ChineseWord) => void;
}

export const AddWordModal: React.FC<AddWordModalProps> = ({
  isOpen,
  onClose,
  savedWords,
  onWordAdded,
}) => {
  const [activeMode, setActiveMode] = useState<'dictionary' | 'custom'>('dictionary');

  // Dictionary Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  // Custom Word Form State
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [hanviet, setHanviet] = useState('');
  const [meaning, setMeaning] = useState('');
  const [pos, setPos] = useState('Danh từ');
  const [level, setLevel] = useState<'HSK1' | 'HSK2' | 'HSK3' | 'TOPIC'>('HSK1');
  const [exampleZh, setExampleZh] = useState('');
  const [examplePinyin, setExamplePinyin] = useState('');
  const [exampleVi, setExampleVi] = useState('');

  const [vietnameseQuickInput, setVietnameseQuickInput] = useState('');
  const [isQuickGenerating, setIsQuickGenerating] = useState(false);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleQuickAutoFill = async () => {
    if (!vietnameseQuickInput.trim()) {
      setFormError('Vui lòng nhập từ tiếng Việt.');
      return;
    }
    setIsQuickGenerating(true);
    setFormError('');
    setFormSuccess('');
    audioService.playClick();
    try {
      const res = await autoGenerateWordFromVietnamese(vietnameseQuickInput.trim());
      if (res.success && res.word) {
        setHanzi(res.word.hanzi);
        setPinyin(res.word.pinyin);
        setHanviet(res.word.hanviet);
        setMeaning(res.word.meaning);
        setPos(res.word.pos || 'Danh từ');
        setLevel((res.word.level as any) || 'HSK1');
        if (res.word.examples && res.word.examples.length > 0) {
          setExampleZh(res.word.examples[0].zh);
          setExamplePinyin(res.word.examples[0].pinyin);
          setExampleVi(res.word.examples[0].vi);
        }
        setFormSuccess(`Đã tự động tạo: "${res.word.hanzi}" (${res.word.pinyin}). Hãy bấm "Lưu vào sổ từ" để hoàn tất!`);
        audioService.playSuccessChime();
      } else {
        setFormError(res.message);
      }
    } catch {
      setFormError('Có lỗi xảy ra khi tạo từ.');
    } finally {
      setIsQuickGenerating(false);
    }
  };

  // Set of saved Hanzi for fast duplicate lookup
  const savedHanziSet = useMemo(() => {
    return new Set(savedWords.map((w) => w.hanzi.trim()));
  }, [savedWords]);

  // Filter dictionary words
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return DICTIONARY_WORDS.filter((item) => {
      // Level filter
      if (selectedLevel !== 'ALL' && item.level !== selectedLevel) {
        return false;
      }
      if (!q) return true;
      return (
        item.hanzi.includes(q) ||
        item.pinyin.toLowerCase().includes(q) ||
        item.hanviet.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedLevel]);

  if (!isOpen) return null;

  const handleAddFromDictionary = (word: ChineseWord) => {
    audioService.playClick();
    const result = storageService.addWord(word);
    if (result.success && result.word) {
      audioService.playSuccessChime();
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.6 },
      });
      onWordAdded(result.word);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const cleanHanzi = hanzi.trim();
    const cleanPinyin = pinyin.trim();
    const cleanMeaning = meaning.trim();

    if (!cleanHanzi) {
      setFormError('Vui lòng nhập chữ Hán.');
      return;
    }
    if (!cleanPinyin) {
      setFormError('Vui lòng nhập phiên âm Pinyin.');
      return;
    }
    if (!cleanMeaning) {
      setFormError('Vui lòng nhập nghĩa tiếng Việt.');
      return;
    }

    if (savedHanziSet.has(cleanHanzi)) {
      setFormError(`Từ "${cleanHanzi}" đã có sẵn trong sổ từ vựng của bạn!`);
      return;
    }

    const examples = [];
    if (exampleZh.trim() && exampleVi.trim()) {
      examples.push({
        zh: exampleZh.trim(),
        pinyin: examplePinyin.trim(),
        vi: exampleVi.trim(),
      });
    }

    const result = storageService.addWord({
      hanzi: cleanHanzi,
      pinyin: cleanPinyin,
      hanviet: hanviet.trim().toUpperCase(),
      meaning: cleanMeaning,
      pos,
      level,
      examples,
    });

    if (result.success && result.word) {
      audioService.playSuccessChime();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
      });
      setFormSuccess(`Đã thêm thành công từ "${cleanHanzi}"!`);
      onWordAdded(result.word);

      // Reset form
      setHanzi('');
      setPinyin('');
      setHanviet('');
      setMeaning('');
      setExampleZh('');
      setExamplePinyin('');
      setExampleVi('');
    } else {
      setFormError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Thêm từ vựng mới</h2>
              <p className="text-xs text-slate-400">Tra cứu từ điển mở rộng hoặc tự nhập từ tùy thích</p>
            </div>
          </div>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex p-2 bg-slate-900 border-b border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setActiveMode('dictionary');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              activeMode === 'dictionary'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tra cứu từ điển ({DICTIONARY_WORDS.length}+ từ)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setActiveMode('custom');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              activeMode === 'custom'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Tự nhập từ mới</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeMode === 'dictionary' ? (
            /* DICTIONARY SEARCH MODE */
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo chữ Hán, Pinyin, Hán Việt, nghĩa..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Level Filter Chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                {['ALL', 'HSK1', 'HSK2', 'HSK3'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      audioService.playClick();
                      setSelectedLevel(lvl);
                    }}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      selectedLevel === lvl
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-750'
                    }`}
                  >
                    {lvl === 'ALL' ? 'Tất cả cấp độ' : lvl}
                  </button>
                ))}
                <span className="text-slate-500 text-[11px] ml-auto shrink-0">
                  {searchResults.length} kết quả
                </span>
              </div>

              {/* Results List */}
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {searchResults.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <p>Không tìm thấy từ nào phù hợp với &quot;{searchQuery}&quot;.</p>
                    <button
                      onClick={() => setActiveMode('custom')}
                      className="mt-2 text-rose-400 hover:underline font-medium"
                    >
                      + Chuyển sang tự nhập từ này
                    </button>
                  </div>
                ) : (
                  searchResults.map((item) => {
                    const isSaved = savedHanziSet.has(item.hanzi.trim());
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-slate-800/80 border border-slate-750 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-slate-100">{item.hanzi}</span>
                            <span className="text-xs text-rose-400 font-medium pinyin-text">
                              {item.pinyin}
                            </span>
                            {item.hanviet && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                {item.hanviet}
                              </span>
                            )}
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300">
                              {item.level}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 truncate">{item.meaning}</p>
                          {item.examples && item.examples.length > 0 && (
                            <p className="text-[11px] text-slate-400 mt-0.5 italic truncate">
                              Ví dụ: {item.examples[0].zh} ({item.examples[0].vi})
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => audioService.speakChinese(item.hanzi)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                            title="Phát âm"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          {isSaved ? (
                            <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center space-x-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Đã có</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddFromDictionary(item)}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center space-x-1 transition-all active:scale-95 shadow-sm shadow-rose-900/30"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Thêm</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* CUSTOM WORD CREATOR MODE */
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* Quick Auto-Fill by Vietnamese Bar */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-800/90 border border-rose-500/30 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tự động tạo từ tiếng Việt (Không cần gõ chữ Hán)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={vietnameseQuickInput}
                    onChange={(e) => setVietnameseQuickInput(e.target.value)}
                    placeholder="Gõ từ tiếng Việt: cà phê, trà, bác sĩ, bạn bè..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleQuickAutoFill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={isQuickGenerating || !vietnameseQuickInput.trim()}
                    onClick={handleQuickAutoFill}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1 shrink-0 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isQuickGenerating ? 'Đang tạo...' : 'Tự tạo'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Hanzi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Chữ Hán <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hanzi}
                    onChange={(e) => setHanzi(e.target.value)}
                    placeholder="VD: 猫, 苹果"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>

                {/* Pinyin */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pinyin <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pinyin}
                    onChange={(e) => setPinyin(e.target.value)}
                    placeholder="VD: māo, píng guǒ"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 pinyin-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Hanviet */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Âm Hán Việt
                  </label>
                  <input
                    type="text"
                    value={hanviet}
                    onChange={(e) => setHanviet(e.target.value)}
                    placeholder="VD: MIÊU, BÌNH QUẢ"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 uppercase font-semibold"
                  />
                </div>

                {/* POS */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Từ loại</label>
                  <select
                    value={pos}
                    onChange={(e) => setPos(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
                  >
                    <option value="Danh từ">Danh từ</option>
                    <option value="Động từ">Động từ</option>
                    <option value="Tính từ">Tính từ</option>
                    <option value="Đại từ">Đại từ</option>
                    <option value="Số từ">Số từ</option>
                    <option value="Lượng từ">Lượng từ</option>
                    <option value="Phó từ">Phó từ</option>
                    <option value="Thán từ">Thán từ</option>
                    <option value="Liên từ">Liên từ</option>
                  </select>
                </div>
              </div>

              {/* Level & Meaning */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cấp độ</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as 'HSK1' | 'HSK2' | 'HSK3' | 'TOPIC')}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
                  >
                    <option value="HSK1">HSK 1</option>
                    <option value="HSK2">HSK 2</option>
                    <option value="HSK3">HSK 3</option>
                    <option value="TOPIC">Mở rộng</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nghĩa tiếng Việt <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    placeholder="VD: Con mèo, Quả táo"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
              </div>

              {/* Optional Example Sentence */}
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">
                  Câu ví dụ thực tế (Tùy chọn)
                </span>
                <input
                  type="text"
                  value={exampleZh}
                  onChange={(e) => setExampleZh(e.target.value)}
                  placeholder="Câu tiếng Trung: 那只小猫很可爱。"
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <input
                  type="text"
                  value={examplePinyin}
                  onChange={(e) => setExamplePinyin(e.target.value)}
                  placeholder="Pinyin câu ví dụ: Nà zhī xiǎomāo hěn kě'ài."
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 pinyin-text"
                />
                <input
                  type="text"
                  value={exampleVi}
                  onChange={(e) => setExampleVi(e.target.value)}
                  placeholder="Dịch tiếng Việt: Chú mèo con kia rất đáng yêu."
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-rose-900/30 flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Lưu vào sổ từ vựng</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
