import React, { useState } from 'react';
import { Search, Volume2, PenTool, Download, Upload, Sparkles, Plus, Trash2, BookOpen, CheckCircle2 } from 'lucide-react';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';
import { storageService } from '../../utils/storage';
import { AddWordModal } from './AddWordModal';
import { DICTIONARY_WORDS } from '../../data/dictionaryData';

interface WordListViewProps {
  words: ChineseWord[];
  onSelectWordForWriting?: (word: ChineseWord) => void;
  onRefreshWords: () => void;
}

export const WordListView: React.FC<WordListViewProps> = ({
  words,
  onSelectWordForWriting,
  onRefreshWords,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredWords = words.filter((w) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      w.hanzi.includes(q) ||
      w.pinyin.toLowerCase().includes(q) ||
      w.hanviet.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    audioService.playClick();
    const jsonStr = storageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hanziflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storageService.importBackup(content);
      if (success) {
        audioService.playSuccessChime();
        setImportMessage('Nhập dữ liệu sao lưu thành công!');
        onRefreshWords();
      } else {
        audioService.playErrorBuzz();
        setImportMessage('Tập tin không hợp lệ, vui lòng kiểm tra lại.');
      }
      setTimeout(() => setImportMessage(null), 3500);
    };
    reader.readAsText(file);
  };

  const handleDeleteWord = (wordId: string, wordHanzi: string) => {
    audioService.playClick();
    if (window.confirm(`Bạn có chắc muốn xóa từ "${wordHanzi}" khỏi sổ từ vựng?`)) {
      storageService.deleteWord(wordId);
      audioService.playErrorBuzz();
      onRefreshWords();
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-md w-full mx-auto p-4 pb-24">
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
          <span>Từ điển ({DICTIONARY_WORDS.length}+)</span>
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
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Stats & Backup Toolbar */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/50 border border-slate-800 mb-3 text-xs text-slate-400">
        <div className="flex items-center space-x-1.5 font-medium text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Sổ từ: {words.length} từ</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
            title="Xuất file sao lưu JSON"
          >
            <Download className="w-3 h-3 text-rose-400" />
            <span>Sao lưu</span>
          </button>

          <label className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors cursor-pointer">
            <Upload className="w-3 h-3 text-amber-400" />
            <span>Phục hồi</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {importMessage && (
        <div className="p-2.5 mb-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{importMessage}</span>
        </div>
      )}

      {/* Word List */}
      <div className="space-y-2.5 overflow-y-auto">
        {filteredWords.length === 0 ? (
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
        ) : (
          filteredWords.map((word) => (
            <div
              key={word.id}
              className="p-3 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-700 transition-all flex items-center justify-between gap-2 shadow-sm"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-850 border border-slate-700/80 flex items-center justify-center text-2xl font-bold text-slate-100 shrink-0 select-all">
                  {word.hanzi}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-sm font-semibold text-rose-400 pinyin-text tracking-normal">
                      {word.pinyin}
                    </span>
                    {word.hanviet && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase">
                        {word.hanviet}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 truncate">{word.meaning}</div>
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
      </div>

      {/* Add Word & Dictionary Modal */}
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        savedWords={words}
        onWordAdded={() => {
          onRefreshWords();
        }}
      />
    </div>
  );
};
