import { useState, useEffect, useRef } from 'react';
import { RotateCw } from 'lucide-react';
import type { ActiveTab, ChineseWord } from './types';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { FlashcardView } from './components/flashcard/FlashcardView';
import { HanziWriterView } from './components/writer/HanziWriterView';
import { AssemblyView } from './components/assembly/AssemblyView';
import { TranslationView } from './components/translation/TranslationView';
import { WordListView } from './components/library/WordListView';
import { storageService } from './utils/storage';
import { audioService } from './utils/audio';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as ActiveTab;
      if (['flashcard', 'writing', 'assembly', 'translation', 'library'].includes(hash)) {
        return hash;
      }
    }
    return 'flashcard';
  });
  const [words, setWords] = useState<ChineseWord[]>(() => storageService.getWords());
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  const loadWords = () => {
    const loaded = storageService.getWords();
    setWords(loaded);
  };

  useEffect(() => {
    loadWords();

    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '') as ActiveTab;
        if (['flashcard', 'writing', 'assembly', 'translation', 'library'].includes(hash)) {
          setActiveTab(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleToggleSound = () => {
    const nextState = !isSoundEnabled;
    setIsSoundEnabled(nextState);
    audioService.setSoundEnabled(nextState);
  };

  const handleUpdateWordSRS = (wordId: string, isCorrect: boolean) => {
    storageService.updateWordSRS(wordId, isCorrect);
    loadWords();
  };

  const handleSelectWordForWriting = (_word: ChineseWord) => {
    handleTabChange('writing');
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'flashcard':
        return { title: 'HanziFlow', subtitle: 'Thẻ từ vựng & phản xạ mặt chữ' };
      case 'writing':
        return { title: 'Luyện Viết', subtitle: 'Tập viết thuận bút chuẩn thư pháp' };
      case 'assembly':
        return { title: 'Ghép Câu', subtitle: 'Tư duy cấu trúc ngữ pháp tiếng Trung' };
      case 'translation':
        return { title: 'Luyện Dịch', subtitle: 'Phản xạ dịch song ngữ 2 chiều' };
      case 'library':
        return { title: 'Kho Từ Vựng', subtitle: 'Tra cứu & quản lý bộ từ HSK' };
    }
  };

  const headerInfo = getHeaderInfo();

  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0 && activeTab !== 'writing') {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || window.scrollY > 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.4, 80));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 55) {
      setIsRefreshing(true);
      audioService.playClick();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      setPullDistance(0);
      setIsPulling(false);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex flex-col min-h-[100dvh] bg-slate-900 text-slate-100"
    >
      <Header
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        onReload={() => window.location.reload()}
      />

      {/* Pull to refresh visual indicator */}
      {pullDistance > 0 && (
        <div
          style={{ height: `${pullDistance}px` }}
          className="overflow-hidden flex items-center justify-center transition-all bg-slate-800/40 border-b border-slate-800 text-xs text-slate-300 gap-1.5 select-none"
        >
          <RotateCw
            className={`w-3.5 h-3.5 text-rose-400 transition-transform ${
              pullDistance > 55 || isRefreshing ? 'animate-spin' : ''
            }`}
            style={{ transform: `rotate(${pullDistance * 4}deg)` }}
          />
          <span>
            {isRefreshing
              ? 'Đang tải lại...'
              : pullDistance > 55
              ? 'Thả tay để tải lại'
              : 'Vuốt xuống để tải lại'}
          </span>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-x-hidden">
        {activeTab === 'flashcard' && (
          <FlashcardView words={words} onUpdateWordSRS={handleUpdateWordSRS} />
        )}

        {activeTab === 'writing' && <HanziWriterView words={words} />}

        {activeTab === 'assembly' && <AssemblyView />}

        {activeTab === 'translation' && <TranslationView />}

        {activeTab === 'library' && (
          <WordListView
            words={words}
            onSelectWordForWriting={handleSelectWordForWriting}
            onRefreshWords={loadWords}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onChangeTab={handleTabChange} />
    </div>
  );
}

export default App;
