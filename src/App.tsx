import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { RotateCw, Sparkles, AlertCircle, X } from 'lucide-react';
import type { ActiveTab, ChineseWord, SentenceExercise, LessonCustomConfig } from './types';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { FlashcardView } from './components/flashcard/FlashcardView';
import { storageService } from './utils/storage';
import { audioService } from './utils/audio';
import { cloudSyncService } from './utils/cloudSync';

// Lazy-load secondary views to dramatically reduce initial bundle size & speed up initial load
const HanziWriterView = lazy(() =>
  import('./components/writer/HanziWriterView').then((m) => ({ default: m.HanziWriterView }))
);
const AssemblyView = lazy(() =>
  import('./components/assembly/AssemblyView').then((m) => ({ default: m.AssemblyView }))
);
const SpeakingView = lazy(() =>
  import('./components/speaking/SpeakingView').then((m) => ({ default: m.SpeakingView }))
);
const WordListView = lazy(() =>
  import('./components/library/WordListView').then((m) => ({ default: m.WordListView }))
);
const GamesHubView = lazy(() =>
  import('./components/games/GamesHubView').then((m) => ({ default: m.GamesHubView }))
);
const CustomLessonModal = lazy(() =>
  import('./components/custom/CustomLessonModal').then((m) => ({ default: m.CustomLessonModal }))
);
const CloudSyncModal = lazy(() =>
  import('./components/common/CloudSyncModal').then((m) => ({ default: m.CloudSyncModal }))
);

const ViewLoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
    <div className="flex flex-col items-center gap-2.5">
      <div className="w-7 h-7 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      <span className="font-medium text-slate-300">Đang tải bài học...</span>
    </div>
  </div>
);

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as ActiveTab;
      if (['flashcard', 'writing', 'assembly', 'speaking', 'games', 'library'].includes(hash)) {
        return hash;
      }
    }
    return 'flashcard';
  });
  const [words, setWords] = useState<ChineseWord[]>(() => storageService.getWords());
  const [sentences, setSentences] = useState<SentenceExercise[]>(() => storageService.getSentences());
  const [lessonConfig, setLessonConfig] = useState<LessonCustomConfig>(() => storageService.getLessonConfig());
  const [isCustomLessonModalOpen, setIsCustomLessonModalOpen] = useState(false);
  const [isCloudSyncModalOpen, setIsCloudSyncModalOpen] = useState(false);
  const [syncToast, setSyncToast] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  const loadWords = () => {
    setWords([...storageService.getWords()]);
    setSentences([...storageService.getSentences()]);
    setLessonConfig({ ...storageService.getLessonConfig() });
  };

  const loadSentences = () => {
    setSentences(storageService.getSentences());
    setLessonConfig(storageService.getLessonConfig());
  };

  const handleSaveLessonConfig = (newConfig: LessonCustomConfig) => {
    storageService.saveLessonConfig(newConfig);
    setLessonConfig(newConfig);
  };

  const handleAddWord = (word: Omit<ChineseWord, 'id'>) => {
    const res = storageService.addWord(word);
    if (res.success && res.word) {
      loadWords();
      // Auto-sync newly added word into active lessons immediately!
      const wordId = res.word.id;
      const updatedConfig: LessonCustomConfig = {
        ...lessonConfig,
        flashcardWordIds: lessonConfig.flashcardWordIds
          ? [wordId, ...lessonConfig.flashcardWordIds.filter((id) => id !== wordId)]
          : undefined,
        writingWordIds: lessonConfig.writingWordIds
          ? [wordId, ...lessonConfig.writingWordIds.filter((id) => id !== wordId)]
          : undefined,
      };
      handleSaveLessonConfig(updatedConfig);
    }
    return res;
  };

  const handleWordAdded = (newWord: ChineseWord) => {
    loadWords();
    const wordId = newWord.id;
    if (lessonConfig.flashcardWordIds || lessonConfig.writingWordIds) {
      const updatedConfig: LessonCustomConfig = {
        ...lessonConfig,
        flashcardWordIds: lessonConfig.flashcardWordIds
          ? [wordId, ...lessonConfig.flashcardWordIds.filter((id) => id !== wordId)]
          : undefined,
        writingWordIds: lessonConfig.writingWordIds
          ? [wordId, ...lessonConfig.writingWordIds.filter((id) => id !== wordId)]
          : undefined,
      };
      handleSaveLessonConfig(updatedConfig);
    }
  };

  const handleAddSentence = (sentence: Omit<SentenceExercise, 'id'>) => {
    const res = storageService.addSentence(sentence);
    if (res.success && res.sentence) {
      loadSentences();
      // Auto-sync newly added sentence into active lessons immediately!
      const sentenceId = res.sentence.id;
      const updatedConfig: LessonCustomConfig = {
        ...lessonConfig,
        assemblySentenceIds: lessonConfig.assemblySentenceIds
          ? [sentenceId, ...lessonConfig.assemblySentenceIds.filter((id) => id !== sentenceId)]
          : undefined,
        speakingSentenceIds: lessonConfig.speakingSentenceIds
          ? [sentenceId, ...lessonConfig.speakingSentenceIds.filter((id) => id !== sentenceId)]
          : undefined,
      };
      handleSaveLessonConfig(updatedConfig);
    }
    return res;
  };

  const handleAddBatchWords = (batchWords: Omit<ChineseWord, 'id'>[]) => {
    const addedIds: string[] = [];
    for (const w of batchWords) {
      const res = storageService.addWord(w);
      if (res.success && res.word) {
        addedIds.push(res.word.id);
      }
    }
    if (addedIds.length > 0) {
      loadWords();
      const updatedConfig: LessonCustomConfig = {
        ...lessonConfig,
        flashcardWordIds: lessonConfig.flashcardWordIds
          ? [...addedIds, ...lessonConfig.flashcardWordIds]
          : undefined,
        writingWordIds: lessonConfig.writingWordIds
          ? [...addedIds, ...lessonConfig.writingWordIds]
          : undefined,
      };
      handleSaveLessonConfig(updatedConfig);
    }
    return addedIds.length;
  };

  const handleAddBatchSentences = (batchSentences: Omit<SentenceExercise, 'id'>[]) => {
    const addedIds: string[] = [];
    for (const s of batchSentences) {
      const res = storageService.addSentence(s);
      if (res.success && res.sentence) {
        addedIds.push(res.sentence.id);
      }
    }
    if (addedIds.length > 0) {
      loadSentences();
      const updatedConfig: LessonCustomConfig = {
        ...lessonConfig,
        assemblySentenceIds: lessonConfig.assemblySentenceIds
          ? [...addedIds, ...lessonConfig.assemblySentenceIds]
          : undefined,
        speakingSentenceIds: lessonConfig.speakingSentenceIds
          ? [...addedIds, ...lessonConfig.speakingSentenceIds]
          : undefined,
      };
      handleSaveLessonConfig(updatedConfig);
    }
    return addedIds.length;
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

  // Memoized filtered lists so unrelated header renders (e.g. sound toggle, opening modal) never reset child views
  const activeFlashcardWords = useMemo(() => {
    const filtered = words.filter(
      (w) => !lessonConfig.flashcardWordIds?.length || lessonConfig.flashcardWordIds.includes(w.id)
    );
    return filtered.length > 0 ? filtered : words;
  }, [words, lessonConfig.flashcardWordIds]);

  const activeWritingWords = useMemo(() => {
    const filtered = words.filter(
      (w) => !lessonConfig.writingWordIds?.length || lessonConfig.writingWordIds.includes(w.id)
    );
    return filtered.length > 0 ? filtered : words;
  }, [words, lessonConfig.writingWordIds]);

  const activeAssemblySentences = useMemo(() => {
    const filtered = sentences.filter(
      (s) => !lessonConfig.assemblySentenceIds?.length || lessonConfig.assemblySentenceIds.includes(s.id)
    );
    return filtered.length > 0 ? filtered : sentences;
  }, [sentences, lessonConfig.assemblySentenceIds]);

  const activeSpeakingSentences = useMemo(() => {
    const filtered = sentences.filter(
      (s) => !lessonConfig.speakingSentenceIds?.length || lessonConfig.speakingSentenceIds.includes(s.id)
    );
    return filtered.length > 0 ? filtered : sentences;
  }, [sentences, lessonConfig.speakingSentenceIds]);

  useEffect(() => {
    if (!syncToast) return;
    const timer = window.setTimeout(() => {
      setSyncToast(null);
    }, 7000);
    return () => window.clearTimeout(timer);
  }, [syncToast]);

  useEffect(() => {
    loadWords();

    void cloudSyncService
      .init(() => {
        loadWords();
      })
      .then((outcome) => {
        if (outcome) {
          setSyncToast({ ok: outcome.ok, text: outcome.message });
          if (outcome.ok) {
            audioService.playSuccessChime();
          }
        }
      });

    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '') as ActiveTab;
        if (['flashcard', 'writing', 'assembly', 'speaking', 'games', 'library'].includes(hash)) {
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
      case 'games':
        return { title: 'Trò Chơi', subtitle: 'Phản xạ chữ Hán qua 3 mini-game 60fps' };
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
    const target = e.target as HTMLElement | null;
    // Never trigger pull-to-refresh when interacting inside modals or 3D Flashcard flip surface
    if (target?.closest('.fixed.inset-0, .perspective-1000')) {
      return;
    }
    if (window.scrollY <= 0 && activeTab !== 'writing' && activeTab !== 'games') {
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
        onOpenCloudSync={() => setIsCloudSyncModalOpen(true)}
      />

      {syncToast && (
        <div className="max-w-md mx-auto w-full px-4 pt-2.5">
          <div
            data-testid="sync-magic-toast"
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-start justify-between gap-2 shadow-lg ${
              syncToast.ok
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-start gap-2">
              {syncToast.ok ? (
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <span>{syncToast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setSyncToast(null)}
              className="p-1 rounded-lg hover:bg-slate-800/60 text-slate-300 shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

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
            words={activeFlashcardWords}
            onUpdateWordSRS={handleUpdateWordSRS}
          />
        )}

        <Suspense fallback={<ViewLoadingFallback />}>
          {activeTab === 'writing' && (
            <HanziWriterView
              words={activeWritingWords}
              initialWordId={selectedWordIdForWriting}
              onClearInitialWordId={() => setSelectedWordIdForWriting(null)}
            />
          )}

          {activeTab === 'assembly' && (
            <AssemblyView sentences={activeAssemblySentences} />
          )}

          {activeTab === 'speaking' && (
            <SpeakingView
              words={activeFlashcardWords}
              sentences={activeSpeakingSentences}
            />
          )}

          {activeTab === 'games' && (
            <GamesHubView
              activeWords={activeFlashcardWords}
              allWords={words}
              onRefreshWords={loadWords}
              onOpenCloudSync={() => setIsCloudSyncModalOpen(true)}
            />
          )}

          {activeTab === 'library' && (
            <WordListView
              words={words}
              onSelectWordForWriting={handleSelectWordForWriting}
              onRefreshWords={loadWords}
              onWordAdded={handleWordAdded}
            />
          )}
        </Suspense>
      </main>

      {isCustomLessonModalOpen && (
        <Suspense fallback={null}>
          <CustomLessonModal
            isOpen={isCustomLessonModalOpen}
            onClose={() => setIsCustomLessonModalOpen(false)}
            words={words}
            sentences={sentences}
            lessonConfig={lessonConfig}
            onSaveConfig={handleSaveLessonConfig}
            onAddWord={handleAddWord}
            onAddSentence={handleAddSentence}
            onAddBatchWords={handleAddBatchWords}
            onAddBatchSentences={handleAddBatchSentences}
            onDeleteSentence={handleDeleteSentence}
            onResetAll={handleResetAllLessons}
          />
        </Suspense>
      )}

      {isCloudSyncModalOpen && (
        <Suspense fallback={null}>
          <CloudSyncModal
            isOpen={isCloudSyncModalOpen}
            onClose={() => setIsCloudSyncModalOpen(false)}
            onDataRestored={loadWords}
          />
        </Suspense>
      )}

      <BottomNav activeTab={activeTab} onChangeTab={handleTabChange} />
    </div>
  );
}

export default App;
