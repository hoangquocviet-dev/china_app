import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord } from '../../types';
import { audioService } from '../../utils/audio';
import { storageService } from '../../utils/storage';
import {
  exportHanziCsv,
  exportHanziTsv,
  exportHanziMarkdown,
  exportHanziJson,
  parseHanziImport,
  type ExportFormat,
} from '../../utils/hanziExportImport';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: ChineseWord[];
  initialTab?: 'export' | 'import';
  onDataChanged: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  words,
  initialTab = 'export',
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>(initialTab);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [importText, setImportText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setIsCopied(false);
    setToastMessage(null);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const dictionaryWords = useMemo(() => {
    if (!isOpen) return [];
    return storageService.getDictionaryWords();
  }, [isOpen]);

  const exportedContent = useMemo(() => {
    if (!isOpen) return '';
    switch (exportFormat) {
      case 'csv':
        return exportHanziCsv(words);
      case 'tsv':
        return exportHanziTsv(words);
      case 'md':
        return exportHanziMarkdown(words);
      case 'json':
        return exportHanziJson(words);
      default:
        return '';
    }
  }, [words, exportFormat, isOpen]);

  const parseResult = useMemo(() => {
    if (!importText.trim()) return null;
    return parseHanziImport(importText, words, dictionaryWords);
  }, [importText, words, dictionaryWords]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    audioService.playClick();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(exportedContent);
      } else {
        const ta = document.createElement('textarea');
        ta.value = exportedContent;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setIsCopied(true);
      audioService.playSuccessChime();
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setToastMessage('Không thể sao chép tự động. Hãy chọn toàn bộ nội dung trong ô để copy.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleDownload = () => {
    audioService.playClick();
    const dateStr = new Date().toISOString().slice(0, 10);
    let filename = `hanziflow-vocab-${dateStr}.${exportFormat}`;
    let mimeType = 'text/plain;charset=utf-8';

    if (exportFormat === 'csv') {
      mimeType = 'text/csv;charset=utf-8';
    } else if (exportFormat === 'tsv') {
      mimeType = 'text/tab-separated-values;charset=utf-8';
      filename = `hanziflow-anki-${dateStr}.tsv`;
    } else if (exportFormat === 'md') {
      mimeType = 'text/markdown;charset=utf-8';
    } else if (exportFormat === 'json') {
      mimeType = 'application/json;charset=utf-8';
      filename = `hanziflow-backup-${dateStr}.json`;
    }

    const blob = new Blob([exportedContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    audioService.playSuccessChime();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setImportText(text);
        audioService.playClick();
      }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };

  const handleExecuteImport = () => {
    if (!parseResult || parseResult.words.length === 0) return;
    audioService.playClick();
    audioService.playSuccessChime();

    // Lưu vào storage notebook
    const currentWords = storageService.getWords();
    const updated = [...currentWords, ...parseResult.words];
    storageService.saveWords(updated);
    storageService.recordStudyActivity();

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });

    onDataChanged();
    setToastMessage(`Đã thêm thành công ${parseResult.words.length} từ vựng vào sổ học!`);
    setImportText('');
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-lg max-h-[94dvh] h-[94dvh] sm:h-auto flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Xuất & Nhập Từ Vựng</h3>
              <p className="text-[11px] text-slate-400">Excel CSV, Anki TSV, Markdown & Sao lưu</p>
            </div>
          </div>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="w-11 h-11 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all active:scale-90 flex items-center justify-center touch-manipulation select-none"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="p-3 bg-slate-850/60 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-750">
            <button
              data-testid="tab-export-btn"
              onClick={() => {
                audioService.playClick();
                setActiveTab('export');
              }}
              className={`min-h-[44px] py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 touch-manipulation select-none ${
                activeTab === 'export'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất dữ liệu ({words.length} từ)</span>
            </button>
            <button
              data-testid="tab-import-btn"
              onClick={() => {
                audioService.playClick();
                setActiveTab('import');
              }}
              className={`min-h-[44px] py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 touch-manipulation select-none ${
                activeTab === 'import'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Nhập dữ liệu</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          {toastMessage && (
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{toastMessage}</span>
            </div>
          )}

          {activeTab === 'export' ? (
            <>
              {/* Format selection */}
              <div>
                <label className="text-slate-400 font-semibold mb-2 block">
                  Chọn định dạng xuất file:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      audioService.playClick();
                      setExportFormat('csv');
                    }}
                    className={`min-h-[64px] p-3 rounded-2xl border text-left transition-all active:scale-95 touch-manipulation select-none ${
                      exportFormat === 'csv'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-slate-800/80 border-slate-750 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Excel CSV</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                        BOM UTF-8
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Mở chuẩn trong Microsoft Excel & Google Sheets
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      audioService.playClick();
                      setExportFormat('tsv');
                    }}
                    className={`min-h-[64px] p-3 rounded-2xl border text-left transition-all active:scale-95 touch-manipulation select-none ${
                      exportFormat === 'tsv'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-slate-800/80 border-slate-750 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Anki / Quizlet</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-semibold">
                        TSV
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Tab-separated import trực tiếp vào Anki
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      audioService.playClick();
                      setExportFormat('md');
                    }}
                    className={`min-h-[64px] p-3 rounded-2xl border text-left transition-all active:scale-95 touch-manipulation select-none ${
                      exportFormat === 'md'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-slate-800/80 border-slate-750 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold">Bảng Markdown</div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Dành cho Notion, Obsidian, GitHub
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      audioService.playClick();
                      setExportFormat('json');
                    }}
                    className={`min-h-[64px] p-3 rounded-2xl border text-left transition-all active:scale-95 touch-manipulation select-none ${
                      exportFormat === 'json'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-slate-800/80 border-slate-750 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold">Sao lưu JSON</div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Sao lưu đầy đủ thuộc tính hệ thống
                    </p>
                  </button>
                </div>
              </div>

              {/* Preview content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-400 font-semibold">Nội dung xem trước:</span>
                  <span className="text-[10px] text-slate-500">
                    {words.length} từ vựng • {exportedContent.length.toLocaleString()} ký tự
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    readOnly
                    value={exportedContent}
                    className="w-full h-36 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Import Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-400 font-semibold">
                    Dán nội dung hoặc chọn tập tin:
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-400 border border-slate-700 font-semibold inline-flex items-center gap-1.5 transition-all active:scale-95 touch-manipulation select-none"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải tệp (.csv, .tsv, .json, .txt)</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv,.tsv,.json,.txt,.md"
                    className="hidden"
                  />
                </div>

                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={`Dán nội dung vào đây, hỗ trợ các định dạng:
1. CSV/TSV: 你好,nǐ hǎo,NHĨ HẢO,Xin chào,Đại từ,HSK1
2. Anki: 你好	nǐ hǎo [NHĨ HẢO]: Xin chào	HSK1
3. Văn bản: 你好 (nǐ hǎo) - Xin chào
4. JSON Backup từ phiên bản cũ`}
                  className="w-full h-40 bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-rose-500 resize-none leading-relaxed placeholder:text-slate-600"
                />
              </div>

              {/* Parsing Feedback Card */}
              {parseResult && (
                <div
                  className={`p-3 rounded-2xl border transition-all ${
                    parseResult.words.length > 0
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>
                          Nhận diện: {parseResult.format.toUpperCase()} • {parseResult.words.length} từ
                          mới hợp lệ
                        </span>
                      </div>
                      <p className="text-[11px] opacity-80 mt-0.5">
                        {parseResult.skippedCount > 0
                          ? `Đã bỏ qua ${parseResult.skippedCount} từ bị trùng hoặc thiếu chữ Hán.`
                          : 'Tất cả các từ vựng đều sẵn sàng nhập vào sổ học.'}
                      </p>
                    </div>
                  </div>

                  {parseResult.words.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                      {parseResult.words.slice(0, 15).map((w, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-200 text-[10px]"
                        >
                          {w.hanzi} ({w.pinyin || 'chưa có phiên âm'})
                        </span>
                      ))}
                      {parseResult.words.length > 15 && (
                        <span className="px-2 py-0.5 text-slate-400 text-[10px]">
                          + {parseResult.words.length - 15} từ khác...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0">
          {activeTab === 'export' ? (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 transition-all active:scale-95 touch-manipulation select-none shadow-xs"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
              <button
                type="button"
                data-testid="export-download-btn"
                onClick={handleDownload}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 transition-all active:scale-95 touch-manipulation select-none shadow-md shadow-rose-900/30"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Tải tệp .{exportFormat}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setImportText('')}
                disabled={!importText}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-300 border border-slate-700 font-semibold transition-all active:scale-95 touch-manipulation select-none"
              >
                Xóa văn bản
              </button>
              <button
                type="button"
                data-testid="execute-import-btn"
                onClick={handleExecuteImport}
                disabled={!parseResult || parseResult.words.length === 0}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 transition-all active:scale-95 touch-manipulation select-none shadow-md shadow-emerald-900/30"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Nhập {parseResult?.words.length || 0} từ vào sổ học</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
