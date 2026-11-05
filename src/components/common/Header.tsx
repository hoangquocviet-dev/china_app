import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, RotateCw, SlidersHorizontal } from 'lucide-react';
import { audioService } from '../../utils/audio';

interface HeaderProps {
  title: string;
  subtitle?: string;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onReload?: () => void;
  onOpenCustomModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  isSoundEnabled,
  onToggleSound,
  onReload,
  onOpenCustomModal,
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleReloadClick = () => {
    audioService.playClick();
    setIsRotating(true);
    setTimeout(() => {
      if (onReload) {
        onReload();
      } else {
        window.location.reload();
      }
    }, 250);
  };
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-900/30 text-white font-bold text-lg select-none">
            汉
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100 flex items-center gap-1.5 leading-tight">
              {title}
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Sparkles className="w-2.5 h-2.5 mr-0.5" /> HSK 1
              </span>
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-400 leading-none mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {onOpenCustomModal && (
            <button
              onClick={() => {
                audioService.playClick();
                onOpenCustomModal();
              }}
              data-testid="header-custom-lesson-btn"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold shadow-sm transition-all active:scale-95"
              title="Tùy chỉnh & thêm bài học: Flashcard, Luyện viết, Ghép câu, Luyện nói"
              aria-label="Custom bài học"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
              <span>Custom</span>
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
