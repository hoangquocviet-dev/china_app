import React from 'react';
import { Layers, PenTool, Puzzle, Languages, BookOpen } from 'lucide-react';
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
    { id: 'translation', label: 'Luyện dịch', icon: Languages },
    { id: 'library', label: 'Từ vựng', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-[var(--sab)]">
      <div className="max-w-md mx-auto grid grid-cols-5 h-[60px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                audioService.playClick();
                onChangeTab(item.id);
              }}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? 'text-rose-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-rose-500/10 scale-105' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[11px] leading-tight select-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
