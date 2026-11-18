import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, RotateCw, SlidersHorizontal, Cloud } from 'lucide-react';
import { audioService } from '../../utils/audio';
import { cloudSyncService, type SyncStatus } from '../../utils/cloudSync';

interface HeaderProps {
  title: string;
  subtitle?: string;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onReload?: () => void;
  onOpenCustomModal?: () => void;
  onOpenCloudSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  isSoundEnabled,
  onToggleSound,
  onReload,
  onOpenCustomModal,
  onOpenCloudSync,
}) => {
  const [isRotating, setIsRotating] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    () => cloudSyncService.getSnapshot().status
  );

  useEffect(() => {
    return cloudSyncService.subscribe(() => {
      setSyncStatus(cloudSyncService.getSnapshot().status);
    });
  }, []);

  const handleReloadClick = async () => {
    audioService.playClick();
    setIsRotating(true);
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
        }
      }
    } catch {
      // Ignore if offline or no SW
    }
    setTimeout(() => {
      if (onReload) {
        onReload();
      } else {
        window.location.reload();
      }
    }, 300);
  };
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-900/30 text-white font-bold text-lg select-none shrink-0">
            汉
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-slate-100 flex items-center gap-1.5 leading-tight">
              <span className="truncate">{title}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                <Sparkles className="w-2.5 h-2.5 mr-0.5" /> HSK 1
              </span>
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-400 leading-none mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          {onOpenCustomModal && (
            <button
              onClick={() => {
                audioService.playClick();
                onOpenCustomModal();
              }}
              data-testid="header-custom-lesson-btn"
              className="flex items-center space-x-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold shadow-sm transition-all active:scale-95"
              title="Tùy chỉnh & thêm bài học: Flashcard, Luyện viết, Ghép câu, Luyện nói"
              aria-label="Custom bài học"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="hidden sm:inline">Custom</span>
            </button>
          )}

          {onOpenCloudSync && (
            <button
              onClick={() => {
                audioService.playClick();
                onOpenCloudSync();
              }}
              data-testid="header-cloud-sync-btn"
              className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors active:scale-95"
              title="Đồng bộ Đám mây & Mã QR chuyển máy"
              aria-label="Đồng bộ Đám mây"
            >
              <Cloud
                className={`w-4 h-4 ${
                  syncStatus === 'synced'
                    ? 'text-emerald-400'
                    : syncStatus === 'syncing'
                    ? 'text-amber-400 animate-pulse'
                    : syncStatus === 'error'
                    ? 'text-rose-400'
                    : 'text-sky-400'
                }`}
              />
              <span
                className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ring-1 ring-slate-900 ${
                  syncStatus === 'synced'
                    ? 'bg-emerald-400'
                    : syncStatus === 'syncing'
                    ? 'bg-amber-400 animate-ping'
                    : syncStatus === 'error'
                    ? 'bg-rose-500'
                    : 'bg-slate-500'
                }`}
              />
            </button>
          )}

          <button
            onClick={handleReloadClick}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors active:scale-95"
            title="Tải lại ứng dụng (Reload)"
            aria-label="Reload App"
          >
            <RotateCw
              className={`w-4 h-4 text-slate-400 hover:text-slate-200 transition-transform duration-500 ${
                isRotating ? 'animate-spin text-rose-400' : ''
              }`}
            />
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              onToggleSound();
            }}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isSoundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            aria-label="Toggle Sound"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-4 h-4 text-rose-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
