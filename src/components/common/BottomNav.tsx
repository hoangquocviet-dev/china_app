import React from 'react';
import { Layers, PenTool, Puzzle, Mic, Gamepad2, BookOpen } from 'lucide-react';
import type { ActiveTab } from '../../types';
import { audioService } from '../../utils/audio';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'flashcard', label: 'Flashcard', icon: Layers },
    { id: 'writing', label: 'Luyện viết', icon: PenTool },
    { id: 'assembly', label: 'Ghép câu', icon: Puzzle },
    { id: 'speaking', label: 'Luyện nói', icon: Mic },
    { id: 'games', label: 'Trò chơi', icon: Gamepad2 },
    { id: 'library', label: 'Từ vựng', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-[var(--sab)]">
      <div className="max-w-md mx-auto grid grid-cols-6 h-[60px] px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              data-tab={item.id}
              aria-label={item.label}
              onClick={() => {
                audioService.playClick();
                onChangeTab(item.id);
              }}
              className={`flex flex-col items-center justify-center space-y-0.5 px-0.5 transition-colors min-w-0 ${
                isActive ? 'text-rose-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-rose-500/10 scale-105' : ''
                }`}
              >
                <Icon className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] leading-tight tracking-tight whitespace-nowrap select-none truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
