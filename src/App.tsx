import { useState, useEffect, useRef } from 'react';
import { RotateCw } from 'lucide-react';
import type { ActiveTab, ChineseWord, SentenceExercise, LessonCustomConfig } from './types';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { FlashcardView } from './components/flashcard/FlashcardView';
import { HanziWriterView } from './components/writer/HanziWriterView';
import { AssemblyView } from './components/assembly/AssemblyView';
import { SpeakingView } from './components/speaking/SpeakingView';
import { WordListView } from './components/library/WordListView';
import { CustomLessonModal } from './components/custom/CustomLessonModal';
import { storageService } from './utils/storage';
import { audioService } from './utils/audio';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as ActiveTab;
      if (['flashcard', 'writing', 'assembly', 'speaking', 'library'].includes(hash)) {
        return hash;
      }
    }
    return 'flashcard';
  });
  const [words, setWords] = useState<ChineseWord[]>(() => storageService.getWords());
  const [sentences, setSentences] = useState<SentenceExercise[]>(() => storageService.getSentences());
  const [lessonConfig, setLessonConfig] = useState<LessonCustomConfig>(() => storageService.getLessonConfig());
  const [isCustomLessonModalOpen, setIsCustomLessonModalOpen] = useState(false);
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

  const loadSentences = () => {
    const loaded = storageService.getSentences();
    setSentences(loaded);
  };

  const handleSaveLessonConfig = (newConfig: LessonCustomConfig) => {
    storageService.saveLessonConfig(newConfig);
    setLessonConfig(newConfig);
  };

  const handleAddWord = (word: Omit<ChineseWord, 'id'>) => {
    const res = storageService.addWord(word);
    if (res.success) {
      loadWords();
    }
    return res;
  };

  const handleAddSentence = (sentence: Omit<SentenceExercise, 'id'>) => {
    const res = storageService.addSentence(sentence);
    if (res.success) {
      loadSentences();
    }
    return res;
  };

  const handleDeleteSentence = (sentenceId: string) => {
    storageService.deleteSentence(sentenceId);
    loadSentences();
  };

  const handleResetAllLessons = () => {
    storageService.resetSentencesToDefaults();
    storageService.resetLessonConfig();
    loadWords();
    loadSentences();
    setLessonConfig({});
  };

  // Filtered lists for each practice mode according to lesson config
  const activeFlashcardWords = words.filter(
    (w) => !lessonConfig.flashcardWordIds?.length || lessonConfig.flashcardWordIds.includes(w.id)
  );

  const activeWritingWords = words.filter(
    (w) => !lessonConfig.writingWordIds?.length || lessonConfig.writingWordIds.includes(w.id)
  );

  const activeAssemblySentences = sentences.filter(
    (s) => !lessonConfig.assemblySentenceIds?.length || lessonConfig.assemblySentenceIds.includes(s.id)
  );

  const activeSpeakingSentences = sentences.filter(
    (s) => !lessonConfig.speakingSentenceIds?.length || lessonConfig.speakingSentenceIds.includes(s.id)
  );

  useEffect(() => {
    loadWords();

    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '') as ActiveTab;
        if (['flashcard', 'writing', 'assembly', 'speaking', 'library'].includes(hash)) {
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

  const [selectedWordIdForWriting, setSelectedWordIdForWriting] = useState<string | null>(null);

  const handleSelectWordForWriting = (word: ChineseWord) => {
    setSelectedWordIdForWriting(word.id);
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
      case 'speaking':
        return { title: 'Luyện Nói', subtitle: 'Phát âm chuẩn thanh điệu & nhận diện giọng nói AI' };
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
        onOpenCustomModal={() => setIsCustomLessonModalOpen(true)}
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
          <FlashcardView
            words={activeFlashcardWords.length > 0 ? activeFlashcardWords : words}
            onUpdateWordSRS={handleUpdateWordSRS}
          />
        )}

        {activeTab === 'writing' && (
          <HanziWriterView
            words={activeWritingWords.length > 0 ? activeWritingWords : words}
            initialWordId={selectedWordIdForWriting}
          />
        )}

        {activeTab === 'assembly' && (
          <AssemblyView
            sentences={activeAssemblySentences.length > 0 ? activeAssemblySentences : sentences}
          />
        )}

        {activeTab === 'speaking' && (
          <SpeakingView
            words={activeFlashcardWords.length > 0 ? activeFlashcardWords : words}
            sentences={activeSpeakingSentences.length > 0 ? activeSpeakingSentences : sentences}
          />
        )}

        {activeTab === 'library' && (
          <WordListView
            words={words}
            onSelectWordForWriting={handleSelectWordForWriting}
            onRefreshWords={loadWords}
          />
        )}
      </main>

      <CustomLessonModal
        isOpen={isCustomLessonModalOpen}
        onClose={() => setIsCustomLessonModalOpen(false)}
        words={words}
        sentences={sentences}
        lessonConfig={lessonConfig}
        onSaveConfig={handleSaveLessonConfig}
        onAddWord={handleAddWord}
        onAddSentence={handleAddSentence}
        onDeleteSentence={handleDeleteSentence}
        onResetAll={handleResetAllLessons}
      />

      <BottomNav activeTab={activeTab} onChangeTab={handleTabChange} />
    </div>
  );
}

export default App;
