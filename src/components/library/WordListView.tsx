import React, { useState, useMemo, useEffect, useRef, useDeferredValue } from 'react';
import {
  Search,
  Volume2,
  PenTool,
  Download,
  Upload,
  Sparkles,
  Plus,
  Trash2,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';
import { storageService } from '../../utils/storage';
import { matchesWordSearch } from '../../utils/pinyinHelper';
import { AddWordModal } from './AddWordModal';
import { ImportExportModal } from './ImportExportModal';
import { RadicalsModal } from '../writer/RadicalsModal';
import { MeasureWordsModal } from '../common/MeasureWordsModal';
import { GrammarHandbookModal } from '../common/GrammarHandbookModal';
import { AntonymsModal } from '../common/AntonymsModal';
import { ConfusingWordsModal } from '../common/ConfusingWordsModal';
import { DialoguesModal } from '../common/DialoguesModal';
import { HanziDecompositionModal } from '../common/HanziDecompositionModal';
import { ChengyuModal } from '../common/ChengyuModal';
import { NumbersTimeModal } from '../common/NumbersTimeModal';
import { SpokenResponsesModal } from '../common/SpokenResponsesModal';
import { ParticlesModal } from '../common/ParticlesModal';
import { PolyphonicModal } from '../common/PolyphonicModal';
import { ConnectorsModal } from '../common/ConnectorsModal';
import { ReduplicationModal } from '../common/ReduplicationModal';
import { ComplementsModal } from '../common/ComplementsModal';

interface WordListViewProps {
  words: ChineseWord[];
  onSelectWordForWriting?: (word: ChineseWord) => void;
  onRefreshWords: () => void;
  onWordAdded?: (newWord: ChineseWord) => void;
}

const getHanziSizeClass = (hanzi: string) => {
  const len = hanzi ? hanzi.length : 0;
  if (len <= 1) return 'text-2xl font-bold';
  if (len === 2) return 'text-lg font-bold';
  if (len === 3) return 'text-sm font-bold tracking-tight';
  return 'text-xs font-semibold tracking-tighter';
};

const PAGE_SIZE = 50;

export const WordListView: React.FC<WordListViewProps> = ({
  words,
  onSelectWordForWriting,
  onRefreshWords,
  onWordAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'HSK1' | 'HSK2' | 'TOPIC'>('ALL');
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isRadicalsModalOpen, setIsRadicalsModalOpen] = useState(false);
  const [isMeasureWordsModalOpen, setIsMeasureWordsModalOpen] = useState(false);
  const [isGrammarHandbookOpen, setIsGrammarHandbookOpen] = useState(false);
  const [isAntonymsModalOpen, setIsAntonymsModalOpen] = useState(false);
  const [isConfusingWordsOpen, setIsConfusingWordsOpen] = useState(false);
  const [isDialoguesModalOpen, setIsDialoguesModalOpen] = useState(false);
  const [isDecompositionOpen, setIsDecompositionOpen] = useState(false);
  const [isChengyuOpen, setIsChengyuOpen] = useState(false);
  const [isNumbersTimeOpen, setIsNumbersTimeOpen] = useState(false);
  const [isSpokenModalOpen, setIsSpokenModalOpen] = useState(false);
  const [isParticlesModalOpen, setIsParticlesModalOpen] = useState(false);
  const [isPolyphonicOpen, setIsPolyphonicOpen] = useState(false);
  const [isConnectorsOpen, setIsConnectorsOpen] = useState(false);
  const [isReduplicationOpen, setIsReduplicationOpen] = useState(false);
  const [isComplementsOpen, setIsComplementsOpen] = useState(false);
  const [importExportTab, setImportExportTab] = useState<'export' | 'import'>('export');
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);

  // useDeferredValue ensures typing remains 120Hz smooth even across thousands of words
  const deferredQuery = useDeferredValue(searchQuery);

  const levelCounts = useMemo(() => {
    let hsk1 = 0;
    let hsk2 = 0;
    let topic = 0;
    for (const w of words) {
      if (w.level === 'HSK1') hsk1++;
      else if (w.level === 'HSK2') hsk2++;
      else topic++;
    }
    return { all: words.length, hsk1, hsk2, topic };
  }, [words]);

  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      if (selectedLevel !== 'ALL' && w.level !== selectedLevel) return false;
      return matchesWordSearch(w, deferredQuery);
    });
  }, [words, deferredQuery, selectedLevel]);

  // Reset display chunk when search query changes
  useEffect(() => {
    setDisplayLimit(PAGE_SIZE);
  }, [deferredQuery]);

  // Slice visible items for instant DOM rendering
  const visibleWords = useMemo(() => {
    return filteredWords.slice(0, displayLimit);
  }, [filteredWords, displayLimit]);

  const hasMore = displayLimit < filteredWords.length;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Auto-load next chunk when scrolling near bottom
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayLimit((prev) => Math.min(filteredWords.length, prev + PAGE_SIZE));
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, filteredWords.length]);

  const handleDeleteWord = (wordId: string, wordHanzi: string) => {
    audioService.playClick();
    if (window.confirm(`Bạn có chắc muốn xóa từ "${wordHanzi}" khỏi sổ từ vựng?`)) {
      storageService.deleteWord(wordId);
      audioService.playErrorBuzz();
      onRefreshWords();
    }
  };

  const handleImportHsk2Pack = () => {
    audioService.playClick();
    audioService.playSuccessChime();
    const result = storageService.importHsk2Pack();
    onRefreshWords();
    setImportMessage(`Đã thêm thành công ${result.addedCount} từ vựng HSK 2 vào sổ học!`);
    setTimeout(() => setImportMessage(null), 4000);
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col pb-24 animate-fadeIn">
      {/* Top Banner: Add Word Primary CTA */}
      <div className="flex items-center justify-between gap-2.5 mb-3">
        <button
          onClick={() => {
            audioService.playClick();
            setIsAddModalOpen(true);
          }}
          className="flex-1 py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md shadow-rose-900/30"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tìm & Thêm từ vựng</span>
        </button>

        <button
          onClick={() => {
            audioService.playClick();
            setIsAddModalOpen(true);
          }}
          className="py-2.5 px-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          title="Mở kho từ điển tra cứu"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Từ điển ({storageService.getDictionaryWords().length}+)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm trong sổ từ: Hán tự, Pinyin, Hán Việt..."
          className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
            title="Xóa tìm kiếm"
            aria-label="Xóa tìm kiếm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Level Filter Chips */}
      <div className="flex items-center space-x-1.5 mb-3 overflow-x-auto pb-1 text-xs select-none scrollbar-none">
        {[
          { id: 'ALL', label: `Tất cả (${levelCounts.all})` },
          { id: 'HSK1', label: `HSK 1 (${levelCounts.hsk1})` },
          { id: 'HSK2', label: `HSK 2 (${levelCounts.hsk2})` },
          { id: 'TOPIC', label: `Chủ đề (${levelCounts.topic})` },
        ].map((tab) => (
          <button
            key={tab.id}
            data-testid={`level-filter-${tab.id.toLowerCase()}`}
            onClick={() => {
              audioService.playClick();
              setSelectedLevel(tab.id as any);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              selectedLevel === tab.id
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats & Multi-Format Backup Toolbar */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/50 border border-slate-800 mb-3 text-xs text-slate-400">
        <div className="flex items-center space-x-1.5 font-medium text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Sổ từ: {words.length} từ</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            data-testid="library-radicals-btn"
            onClick={() => {
              audioService.playClick();
              setIsRadicalsModalOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-colors shadow-xs"
            title="Khám phá 50 bộ thủ chữ Hán thông dụng"
          >
            <span>🏮 Bộ thủ</span>
          </button>

          <button
            data-testid="open-measure-words-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsMeasureWordsModalOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors shadow-xs"
            title="Tra cứu 16 lượng từ thiết yếu HSK 1 - 2"
          >
            <span>📏 Lượng từ</span>
          </button>

          <button
            data-testid="open-grammar-handbook-btn"
            onClick={() => {
              audioService.playClick();
              setIsGrammarHandbookOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-blue-300 border border-blue-500/20 hover:border-blue-500/40 transition-colors shadow-xs"
            title="Sổ tay 20 cấu trúc ngữ pháp trọng điểm HSK 1 - 2"
          >
            <span>📘 Ngữ pháp</span>
          </button>

          <button
            data-testid="open-antonyms-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsAntonymsModalOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-teal-300 border border-teal-500/20 hover:border-teal-500/40 transition-colors shadow-xs"
            title="Tra cứu 24 cặp từ trái nghĩa HSK 1 - 2 & Quiz phản xạ"
          >
            <span>↔️ Từ trái nghĩa</span>
          </button>

          <button
            data-testid="open-confusing-words-btn"
            onClick={() => {
              audioService.playClick();
              setIsConfusingWordsOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-violet-300 border border-violet-500/20 hover:border-violet-500/40 transition-colors shadow-xs"
            title="Bí kíp phân biệt 16 cặp từ dễ nhầm lẫn HSK 1 - 2"
          >
            <span>🔍 Phân biệt từ</span>
          </button>

          <button
            data-testid="open-dialogues-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsDialoguesModalOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors shadow-xs"
            title="Hội thoại 10 tình huống thực tế HSK 1 - 2"
          >
            <span>💬 Hội thoại</span>
          </button>

          <button
            data-testid="open-decomposition-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsDecompositionOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-colors shadow-xs"
            title="Chiết tự chữ Hán & bí quyết ghi nhớ liên tưởng"
          >
            <span>🧩 Chiết tự</span>
          </button>

          <button
            data-testid="open-chengyu-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsChengyuOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-300 border border-rose-500/20 hover:border-rose-500/40 transition-colors shadow-xs"
            title="Kho tàng thành ngữ Hán - Việt 4 chữ & điển cố"
          >
            <span>🏮 Thành ngữ</span>
          </button>

          <button
            data-testid="open-numbers-time-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsNumbersTimeOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors shadow-xs"
            title="Số đếm, đổi số, xem giờ giấc & tiền tệ"
          >
            <span>⏰ Số & Giờ</span>
          </button>

          <button
            data-testid="open-spoken-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsSpokenModalOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors shadow-xs"
            title="Khẩu ngữ giao tiếp & phản xạ ứng đáp"
          >
            <span>💬 Khẩu ngữ</span>
          </button>

          <button
            data-testid="open-particles-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsParticlesModalOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-violet-300 border border-violet-500/20 hover:border-violet-500/40 transition-colors shadow-xs"
            title="Bí kíp 3 chữ ĐÍCH (的·得·地) & Trợ từ tiếng Trung"
          >
            <span>🔤 Trợ từ</span>
          </button>

          <button
            data-testid="open-polyphonic-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsPolyphonicOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-colors shadow-xs"
            title="Chữ Hán đa âm tiết (多音字) - 1 chữ nhiều cách đọc"
          >
            <span>🎭 Đa âm</span>
          </button>

          <button
            data-testid="open-connectors-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsConnectorsOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors shadow-xs"
            title="Kho 18 cặp liên từ nối câu HSK 1 - 3"
          >
            <span>🔗 Liên từ</span>
          </button>

          <button
            data-testid="open-reduplication-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsReduplicationOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors shadow-xs"
            title="Bí kíp trùng điệp từ & từ láy HSK (AA, ABAB, AAB, AABB)"
          >
            <span>✨ Trùng điệp</span>
          </button>

          <button
            data-testid="open-complements-modal-btn"
            onClick={() => {
              audioService.playClick();
              setIsComplementsOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors shadow-xs"
            title="Kho 4 dạng bổ ngữ trọng yếu HSK 1 - 3"
          >
            <span>🎯 Bổ ngữ</span>
          </button>

          <button
            data-testid="open-export-modal-btn"
            onClick={() => {
              audioService.playClick();
              setImportExportTab('export');
              setIsImportExportOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-300 border border-rose-500/20 hover:border-rose-500/40 transition-colors shadow-xs"
            title="Xuất từ vựng: Excel CSV, Anki TSV, Markdown, JSON"
          >
            <Download className="w-3 h-3 text-rose-400" />
            <span>Xuất file</span>
          </button>

          <button
            data-testid="open-import-modal-btn"
            onClick={() => {
              audioService.playClick();
              setImportExportTab('import');
              setIsImportExportOpen(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-colors shadow-xs"
            title="Nhập từ vựng: CSV, TSV Anki, văn bản hoặc sao lưu JSON"
          >
            <Upload className="w-3 h-3 text-amber-400" />
            <span>Nhập file</span>
          </button>
        </div>
      </div>

      {importMessage && (
        <div className="p-2.5 mb-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{importMessage}</span>
        </div>
      )}

      {/* Word List with progressive chunk rendering & content-visibility optimization */}
      <div className="space-y-2.5 overflow-y-auto">
        {filteredWords.length === 0 ? (
          selectedLevel === 'HSK2' && levelCounts.hsk2 === 0 ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-850 to-slate-900 border border-amber-500/30 text-center my-2 shadow-xl animate-fadeIn">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                Sổ học chưa có từ vựng HSK 2
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Bạn đã sẵn sàng nâng cấp lên HSK 2? Nhập ngay trọn bộ 127 từ vựng HSK 2 chuẩn vào sổ học để mở rộng Flashcard, Luyện viết & Mini-games ngay!
              </p>
              <button
                data-testid="import-hsk2-pack-btn"
                onClick={handleImportHsk2Pack}
                className="mt-4 py-2.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 flex items-center gap-1.5 mx-auto active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>+ Nhập Trọn Bộ 127 Từ HSK 2 (1-Click)</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-3xl bg-slate-850/50 border border-dashed border-slate-800 text-slate-400 text-xs space-y-3">
              <p>
                {searchQuery
                  ? `Không tìm thấy từ vựng nào phù hợp với "${searchQuery}".`
                  : 'Sổ từ vựng của bạn đang trống.'}
              </p>
              <button
                onClick={() => {
                  audioService.playClick();
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tra từ điển hoặc Thêm từ mới</span>
              </button>
            </div>
          )
        ) : (
          visibleWords.map((word) => (
            <div
              key={word.id}
              className="p-3 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-all flex items-center justify-between gap-2.5 shadow-sm"
              style={{
                contentVisibility: 'auto',
                containIntrinsicSize: '0 72px',
              }}
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {/* Balanced Hanzi container: strictly horizontal, auto scaling, no vertical wrapping */}
                <div
                  className={`hanzi-badge min-w-[4.25rem] max-w-[5rem] px-2 h-12 rounded-xl bg-slate-850/90 border border-slate-700/80 font-bold text-slate-100 select-all shadow-xs ${getHanziSizeClass(
                    word.hanzi
                  )}`}
                  style={{
                    whiteSpace: 'nowrap',
                    wordBreak: 'keep-all',
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={word.hanzi}
                >
                  {word.hanzi}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-0.5">
                    <span className="text-sm font-semibold text-rose-400 pinyin-text tracking-normal">
                      {word.pinyin}
                    </span>
                    {word.hanviet && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider leading-none">
                        {word.hanviet}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">{word.meaning}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {word.pos} • Hộp SRS {word.box || 1}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  onClick={() => {
                    audioService.playClick();
                    audioService.speakChinese(word.hanzi);
                  }}
                  className="p-2 rounded-xl bg-slate-750 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                {onSelectWordForWriting && (
                  <button
                    onClick={() => {
                      audioService.playClick();
                      onSelectWordForWriting(word);
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors border border-rose-500/20"
                    title="Luyện viết từ này"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteWord(word.id, word.hanzi)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors border border-slate-700/60"
                  title="Xóa từ này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Sentinel & Show More Button for Large Vocabularies */}
        {hasMore && (
          <div ref={sentinelRef} className="pt-2 text-center">
            <button
              onClick={() => setDisplayLimit((prev) => Math.min(filteredWords.length, prev + PAGE_SIZE))}
              className="py-2.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold inline-flex items-center space-x-2 transition-all active:scale-95 shadow-sm"
            >
              <span>Xem thêm từ ({displayLimit} / {filteredWords.length})</span>
              <ChevronDown className="w-3.5 h-3.5 text-rose-400" />
            </button>
          </div>
        )}
      </div>

      {/* Add Word & Dictionary Modal */}
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        savedWords={words}
        onWordAdded={(newWord) => {
          onRefreshWords();
          onWordAdded?.(newWord);
        }}
      />

      {/* Multi-format Import / Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        words={words}
        initialTab={importExportTab}
        onDataChanged={onRefreshWords}
      />

      {/* 50 Common Radicals Modal */}
      <RadicalsModal
        isOpen={isRadicalsModalOpen}
        onClose={() => setIsRadicalsModalOpen(false)}
        onSelectCharacter={(ch) => setSearchQuery(ch)}
      />

      {/* 16 Essential Measure Words Modal */}
      <MeasureWordsModal
        isOpen={isMeasureWordsModalOpen}
        onClose={() => setIsMeasureWordsModalOpen(false)}
      />

      {/* 20 Core Grammar Patterns Handbook Modal */}
      <GrammarHandbookModal
        isOpen={isGrammarHandbookOpen}
        onClose={() => setIsGrammarHandbookOpen(false)}
      />

      {/* 24 Essential Antonym Pairs & Quiz Modal */}
      <AntonymsModal
        isOpen={isAntonymsModalOpen}
        onClose={() => setIsAntonymsModalOpen(false)}
      />

      {/* 16 Confusing Words & Near-Synonyms Modal */}
      <ConfusingWordsModal
        isOpen={isConfusingWordsOpen}
        onClose={() => setIsConfusingWordsOpen(false)}
      />

      {/* 10 Real-world Situational Dialogues Modal */}
      <DialoguesModal
        isOpen={isDialoguesModalOpen}
        onClose={() => setIsDialoguesModalOpen(false)}
      />

      {/* Hanzi Decomposition & Mnemonics Modal */}
      <HanziDecompositionModal
        isOpen={isDecompositionOpen}
        onClose={() => setIsDecompositionOpen(false)}
      />

      {/* 24 Core Chengyu Idioms & Cultural Stories Modal */}
      <ChengyuModal
        isOpen={isChengyuOpen}
        onClose={() => setIsChengyuOpen(false)}
      />

      {/* Numbers, Time, Dates & Currency Modal */}
      <NumbersTimeModal
        isOpen={isNumbersTimeOpen}
        onClose={() => setIsNumbersTimeOpen(false)}
      />

      {/* Spoken Responses & Reflex Modal */}
      <SpokenResponsesModal
        isOpen={isSpokenModalOpen}
        onClose={() => setIsSpokenModalOpen(false)}
        onSelectCharacter={onSelectWordForWriting ? (char) => {
          const match = words.find((w) => w.hanzi.includes(char));
          if (match) onSelectWordForWriting(match);
        } : undefined}
      />

      {/* Chinese Particles & Three DEs Modal */}
      <ParticlesModal
        isOpen={isParticlesModalOpen}
        onClose={() => setIsParticlesModalOpen(false)}
        onSelectCharacter={onSelectWordForWriting ? (char) => {
          const match = words.find((w) => w.hanzi.includes(char));
          if (match) onSelectWordForWriting(match);
        } : undefined}
      />

      {/* Polyphonic Characters Modal */}
      <PolyphonicModal
        isOpen={isPolyphonicOpen}
        onClose={() => setIsPolyphonicOpen(false)}
        onSelectCharacter={onSelectWordForWriting ? (char) => {
          const match = words.find((w) => w.hanzi.includes(char));
          if (match) onSelectWordForWriting(match);
        } : undefined}
      />

      {/* Connectors & Conjunctions Modal */}
      <ConnectorsModal
        isOpen={isConnectorsOpen}
        onClose={() => setIsConnectorsOpen(false)}
        onSelectCharacter={onSelectWordForWriting ? (char) => {
          const match = words.find((w) => w.hanzi.includes(char));
          if (match) onSelectWordForWriting(match);
        } : undefined}
      />

      {/* Reduplication & Word Duplication Modal */}
      <ReduplicationModal
        isOpen={isReduplicationOpen}
        onClose={() => setIsReduplicationOpen(false)}
        onSelectCharacter={onSelectWordForWriting ? (char) => {
          const match = words.find((w) => w.hanzi.includes(char));
          if (match) onSelectWordForWriting(match);
        } : undefined}
      />

      {/* Complements Master Modal */}
      <ComplementsModal
        isOpen={isComplementsOpen}
        onClose={() => setIsComplementsOpen(false)}
        onSelectCharacter={onSelectWordForWriting ? (char) => {
          const match = words.find((w) => w.hanzi.includes(char));
          if (match) onSelectWordForWriting(match);
        } : undefined}
      />
    </div>
  );
};
