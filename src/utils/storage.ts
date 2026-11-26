import { INITIAL_WORDS } from '../data/hsk1Words';
import { INITIAL_SENTENCES } from '../data/hsk1Sentences';
import { DICTIONARY_WORDS } from '../data/dictionaryData';
import type {
  ChineseWord,
  SentenceExercise,
  LessonCustomConfig,
  GameScores,
  BuiltInSrsProgress,
  CommunityWordRow,
  StreakDetails,
} from '../types';

const STORAGE_KEYS = {
  WORDS: 'hanziflow_words',
  FAVORITES: 'hanziflow_favorites',
  ACTIVE_TAB: 'hanziflow_active_tab',
  STREAK: 'hanziflow_streak',
  STREAK_DETAILS: 'hanziflow_streak_details',
  BACKUP: 'hanziflow_backup',
  SENTENCES: 'hanziflow_sentences',
  LESSON_CONFIG: 'hanziflow_lesson_config',
  CUSTOM_DICTIONARY: 'hanziflow_custom_dictionary',
  CLOUD_COMMUNITY_WORDS: 'hanziflow_cloud_community_words',
  MASTERED_FLASHCARDS: 'hanziflow_flashcard_mastered_ids',
  DELETED_WORDS: 'hanziflow_deleted_words',
  DELETED_SENTENCES: 'hanziflow_deleted_sentences',
  GAME_SCORES: 'hanziflow_game_scores',
};

const SYNCED_MUTATION_KEYS = new Set<string>([
  STORAGE_KEYS.WORDS,
  STORAGE_KEYS.SENTENCES,
  STORAGE_KEYS.LESSON_CONFIG,
  STORAGE_KEYS.CUSTOM_DICTIONARY,
  STORAGE_KEYS.MASTERED_FLASHCARDS,
  STORAGE_KEYS.DELETED_WORDS,
  STORAGE_KEYS.DELETED_SENTENCES,
  STORAGE_KEYS.GAME_SCORES,
  STORAGE_KEYS.STREAK,
]);

const DEFAULT_GAME_SCORES: GameScores = {
  blitzBestScore: 0,
  blitzBestCombo: 0,
  matchBestScore: 0,
  matchBestWaves: 0,
  runnerBestScore: 0,
  runnerBestDistance: 0,
  totalGamesPlayed: 0,
};

class SafeStorageService {
  // In-memory cache for high-frequency reads (avoids repeated JSON.parse overhead on massive datasets)
  private memoryCache: Map<string, any> = new Map();
  private cachedMergedDictionary: ChineseWord[] | null = null;
  private mutationListeners: Set<() => void> = new Set();
  private suppressMutationNotify: boolean = false;
  private communityWordHook: ((word: ChineseWord) => void) | null = null;

  public subscribeMutations(listener: () => void): () => void {
    this.mutationListeners.add(listener);
    return () => {
      this.mutationListeners.delete(listener);
    };
  }

  public subscribe(listener: () => void): () => void {
    return this.subscribeMutations(listener);
  }

  public registerCommunityWordHook(hook: (word: ChineseWord) => void): void {
    this.communityWordHook = hook;
  }

  private notifyMutations(): void {
    if (this.suppressMutationNotify) return;
    for (const fn of this.mutationListeners) {
      try {
        fn();
      } catch {}
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private get<T>(key: string, fallback: T): T {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key) as T;
    }

    if (!this.isLocalStorageAvailable()) return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        this.memoryCache.set(key, fallback);
        return fallback;
      }
      const parsed = JSON.parse(item) as T;
      this.memoryCache.set(key, parsed);
      return parsed;
    } catch (e) {
      console.warn(`[Storage] Failed to parse key: ${key}. Backing up and falling back.`, e);
      try {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          window.localStorage.setItem(`${STORAGE_KEYS.BACKUP}_corrupted_${Date.now()}`, raw);
        }
      } catch {}
      this.memoryCache.set(key, fallback);
      return fallback;
    }
  }

  private set<T>(key: string, value: T, notify: boolean = true): boolean {
    this.memoryCache.set(key, value);
    if (!this.isLocalStorageAvailable()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      if (notify && SYNCED_MUTATION_KEYS.has(key)) {
        this.notifyMutations();
      }
      return true;
    } catch (e) {
      console.error(`[Storage] Failed to save key: ${key}`, e);
      return false;
    }
  }

  public clearMemoryCache(): void {
    this.memoryCache.clear();
    this.cachedMergedDictionary = null;
  }

  public getWords(): ChineseWord[] {
    const words = this.get<ChineseWord[]>(STORAGE_KEYS.WORDS, []);
    if (!words || words.length === 0) {
      this.set(STORAGE_KEYS.WORDS, INITIAL_WORDS, false);
      return INITIAL_WORDS;
    }
    // Auto-merge newly added official words if missing from user's notebook (unless intentionally deleted)
    const existingHanzis = new Set(words.map((w) => w.hanzi.trim()));
    const deletedHanzis = new Set(this.get<string[]>(STORAGE_KEYS.DELETED_WORDS, []));
    const missingDefaults = INITIAL_WORDS.filter(
      (w) => !existingHanzis.has(w.hanzi.trim()) && !deletedHanzis.has(w.hanzi.trim())
    );
    if (missingDefaults.length > 0) {
      const merged = [...words, ...missingDefaults];
      this.saveWords(merged);
      return merged;
    }
    return words;
  }

  public addWord(word: Omit<ChineseWord, 'id'> & { id?: string }): { success: boolean; message: string; word?: ChineseWord } {
    const words = this.getWords();
    const cleanHanzi = word.hanzi.trim();
    if (!cleanHanzi) {
      return { success: false, message: 'Vui lòng nhập chữ Hán.' };
    }

    const exists = words.some((w) => w.hanzi.trim() === cleanHanzi);
    if (exists) {
      return { success: false, message: `Từ "${cleanHanzi}" đã có trong sổ từ vựng của bạn.` };
    }

    // If previously deleted, unmark it
    const deletedHanzis = this.get<string[]>(STORAGE_KEYS.DELETED_WORDS, []);
    if (deletedHanzis.includes(cleanHanzi)) {
      this.set(
        STORAGE_KEYS.DELETED_WORDS,
        deletedHanzis.filter((h) => h !== cleanHanzi)
      );
    }

    const newWord: ChineseWord = {
      ...word,
      id: word.id || `word_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      hanzi: cleanHanzi,
      pinyin: word.pinyin.trim(),
      hanviet: word.hanviet ? word.hanviet.trim().toUpperCase() : '',
      meaning: word.meaning.trim(),
      pos: word.pos || 'Danh từ',
      level: word.level || 'HSK1',
      examples: word.examples || [],
      box: word.box || 1,
      lastReviewed: undefined,
    };

    const updated = [newWord, ...words];
    this.saveWords(updated);

    // Tự động đồng bộ từ mới này vào Database kho từ điển (Dictionary DB) của hệ thống
    this.addWordToDictionary(newWord);

    return { success: true, message: `Đã thêm thành công "${cleanHanzi}" vào sổ từ!`, word: newWord };
  }

  // --- Dictionary Database Management (Kho từ điển dùng chung Local + Cloud Community DB) ---
  public getCustomDictionaryWords(): ChineseWord[] {
    return this.get<ChineseWord[]>(STORAGE_KEYS.CUSTOM_DICTIONARY, []);
  }

  public getCommunityDictionaryWords(): ChineseWord[] {
    return this.get<ChineseWord[]>(STORAGE_KEYS.CLOUD_COMMUNITY_WORDS, []);
  }

  public mergeCommunityWordsIntoDictionary(rows: CommunityWordRow[]): boolean {
    if (!Array.isArray(rows) || rows.length === 0) return false;
    const mapped: ChineseWord[] = rows.map((r) => ({
      id: `comm_${r.id}`,
      hanzi: r.hanzi.trim(),
      pinyin: r.pinyin.trim(),
      hanviet: (r.hanviet || '').trim().toUpperCase(),
      meaning: r.meaning.trim(),
      pos: r.pos || 'Danh từ',
      level: r.level || 'HSK1',
      examples: Array.isArray(r.examples) ? r.examples : [],
      box: 1,
    }));
    this.set(STORAGE_KEYS.CLOUD_COMMUNITY_WORDS, mapped, false);
    this.cachedMergedDictionary = null;
    return true;
  }

  public getDictionaryWords(): ChineseWord[] {
    if (this.cachedMergedDictionary) {
      return this.cachedMergedDictionary;
    }
    const customWords = this.getCustomDictionaryWords();
    const communityWords = this.getCommunityDictionaryWords();
    const seenHanzis = new Set<string>();
    const combined: ChineseWord[] = [];

    for (const w of customWords) {
      const h = w.hanzi.trim();
      if (h && !seenHanzis.has(h)) {
        seenHanzis.add(h);
        combined.push(w);
      }
    }
    for (const w of communityWords) {
      const h = w.hanzi.trim();
      if (h && !seenHanzis.has(h)) {
        seenHanzis.add(h);
        combined.push(w);
      }
    }
    for (const w of DICTIONARY_WORDS) {
      const h = w.hanzi.trim();
      if (h && !seenHanzis.has(h)) {
        seenHanzis.add(h);
        combined.push(w);
      }
    }

    this.cachedMergedDictionary = combined;
    return this.cachedMergedDictionary;
  }

  public addWordToDictionary(word: ChineseWord): void {
    const cleanHanzi = word.hanzi.trim();
    if (!cleanHanzi) return;

    const customWords = this.getCustomDictionaryWords();
    const alreadyInCustom = customWords.some((w) => w.hanzi.trim() === cleanHanzi);
    if (!alreadyInCustom) {
      const alreadyInDefault = DICTIONARY_WORDS.some((w) => w.hanzi.trim() === cleanHanzi);
      const alreadyInCommunity = this.getCommunityDictionaryWords().some(
        (w) => w.hanzi.trim() === cleanHanzi
      );
      if (!alreadyInDefault && !alreadyInCommunity) {
        const dictWord: ChineseWord = {
          ...word,
          id: `dict_${word.id || Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          hanzi: cleanHanzi,
          box: 1,
        };
        const updated = [dictWord, ...customWords];
        this.set(STORAGE_KEYS.CUSTOM_DICTIONARY, updated);
        this.cachedMergedDictionary = null; // Invalidate dictionary cache
        this.communityWordHook?.(dictWord);
      }
    }
  }

  // --- Official HSK 2 Pack Import ---
  public importHsk2Pack(): { addedCount: number; totalHsk2: number } {
    const hsk2Words = DICTIONARY_WORDS.filter((w) => w.level === 'HSK2');
    const currentWords = this.getWords();
    const existingHanzis = new Set(currentWords.map((w) => w.hanzi.trim()));
    const toAdd = hsk2Words.filter((w) => !existingHanzis.has(w.hanzi.trim()));

    if (toAdd.length > 0) {
      const updated = [...currentWords, ...toAdd];
      this.saveWords(updated);
      this.recordStudyActivity();
      this.notifyMutations();
    }
    return { addedCount: toAdd.length, totalHsk2: hsk2Words.length };
  }

  // --- Mastered Flashcards Management ---
  public getMasteredFlashcardIds(): string[] {
    return this.get<string[]>(STORAGE_KEYS.MASTERED_FLASHCARDS, []);
  }

  public saveMasteredFlashcardIds(ids: string[]): void {
    this.set(STORAGE_KEYS.MASTERED_FLASHCARDS, ids);
  }

  public resetMasteredFlashcards(): void {
    this.memoryCache.delete(STORAGE_KEYS.MASTERED_FLASHCARDS);
    if (this.isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.MASTERED_FLASHCARDS);
      } catch {}
    }
    this.notifyMutations();
  }

  public deleteWord(wordId: string): boolean {
    const words = this.getWords();
    const wordToDelete = words.find((w) => w.id === wordId);
    if (wordToDelete) {
      const cleanHanzi = wordToDelete.hanzi.trim();
      const deletedHanzis = this.get<string[]>(STORAGE_KEYS.DELETED_WORDS, []);
      if (!deletedHanzis.includes(cleanHanzi)) {
        this.set(STORAGE_KEYS.DELETED_WORDS, [...deletedHanzis, cleanHanzi]);
      }
    }
    const updated = words.filter((w) => w.id !== wordId);
    this.saveWords(updated);

    // Clean up from mastered flashcard IDs if present
    const mastered = this.getMasteredFlashcardIds();
    if (mastered.includes(wordId)) {
      this.saveMasteredFlashcardIds(mastered.filter((id) => id !== wordId));
    }

    // Prune deleted wordId from custom lesson config to prevent orphaned selections
    const cfg = this.getLessonConfig();
    if (cfg.flashcardWordIds?.includes(wordId) || cfg.writingWordIds?.includes(wordId)) {
      const nextFlash = cfg.flashcardWordIds?.filter((id) => id !== wordId);
      const nextWrite = cfg.writingWordIds?.filter((id) => id !== wordId);
      this.saveLessonConfig({
        ...cfg,
        flashcardWordIds: nextFlash && nextFlash.length > 0 ? nextFlash : undefined,
        writingWordIds: nextWrite && nextWrite.length > 0 ? nextWrite : undefined,
      });
    }
    return true;
  }

  public isWordInLibrary(hanzi: string): boolean {
    const words = this.getWords();
    return words.some((w) => w.hanzi.trim() === hanzi.trim());
  }

  public saveWords(words: ChineseWord[]): void {
    this.set(STORAGE_KEYS.WORDS, words);
  }

  public updateWordSRS(wordId: string, isCorrect: boolean): void {
    const words = this.getWords();
    const updated = words.map((w) => {
      if (w.id === wordId) {
        const currentBox = w.box || 1;
        const newBox = isCorrect ? Math.min(5, currentBox + 1) : 1;
        return {
          ...w,
          box: newBox,
          lastReviewed: Date.now(),
        };
      }
      return w;
    });
    this.saveWords(updated);
  }

  // Sentence Management (for Ghép câu and Luyện nói)
  public getSentences(): SentenceExercise[] {
    const sentences = this.get<SentenceExercise[]>(STORAGE_KEYS.SENTENCES, []);
    if (!sentences || sentences.length === 0) {
      this.set(STORAGE_KEYS.SENTENCES, INITIAL_SENTENCES, false);
      return INITIAL_SENTENCES;
    }
    const existingTargets = new Set(sentences.map((s) => s.targetSentence.trim()));
    const deletedTargets = new Set(this.get<string[]>(STORAGE_KEYS.DELETED_SENTENCES, []));
    const missingDefaults = INITIAL_SENTENCES.filter(
      (s) => !existingTargets.has(s.targetSentence.trim()) && !deletedTargets.has(s.targetSentence.trim())
    );
    if (missingDefaults.length > 0) {
      const merged = [...sentences, ...missingDefaults];
      this.saveSentences(merged);
      return merged;
    }
    return sentences;
  }

  public saveSentences(sentences: SentenceExercise[]): void {
    this.set(STORAGE_KEYS.SENTENCES, sentences);
  }

  public addSentence(sentence: Omit<SentenceExercise, 'id'> & { id?: string }): {
    success: boolean;
    message: string;
    sentence?: SentenceExercise;
  } {
    const sentences = this.getSentences();
    const cleanTarget = sentence.targetSentence.trim();
    if (!cleanTarget) {
      return { success: false, message: 'Vui lòng nhập câu tiếng Trung.' };
    }

    const cleanSource = sentence.sourceSentence.trim();
    if (!cleanSource) {
      return { success: false, message: 'Vui lòng nhập dịch nghĩa tiếng Việt.' };
    }

    const exists = sentences.some((s) => s.targetSentence.trim() === cleanTarget);
    if (exists) {
      return { success: false, message: `Câu "${cleanTarget}" đã tồn tại trong danh sách bài học.` };
    }

    // If previously deleted, unmark it
    const deletedTargets = this.get<string[]>(STORAGE_KEYS.DELETED_SENTENCES, []);
    if (deletedTargets.includes(cleanTarget)) {
      this.set(
        STORAGE_KEYS.DELETED_SENTENCES,
        deletedTargets.filter((t) => t !== cleanTarget)
      );
    }

    // Auto-generate tokens if not provided
    let tokens = sentence.tokens && sentence.tokens.length > 0 ? sentence.tokens : [];
    if (tokens.length === 0) {
      const cleanChars = cleanTarget.replace(/[。，！？.!?]/g, '');
      tokens = cleanChars.includes(' ') ? cleanChars.split(/\s+/) : Array.from(cleanChars);
    }

    const newSentence: SentenceExercise = {
      ...sentence,
      id: sentence.id || `sent_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      targetSentence: cleanTarget,
      sourceSentence: cleanSource,
      pinyin: sentence.pinyin ? sentence.pinyin.trim() : '',
      tokens,
      distractorTokens: sentence.distractorTokens || [],
      isCustom: true,
      includeInAssembly: sentence.includeInAssembly !== false,
      includeInSpeaking: sentence.includeInSpeaking !== false,
    };

    const updated = [newSentence, ...sentences];
    this.saveSentences(updated);
    return { success: true, message: `Đã thêm thành công câu mới vào bài học!`, sentence: newSentence };
  }

  public deleteSentence(sentenceId: string): boolean {
    const sentences = this.getSentences();
    const sentToDelete = sentences.find((s) => s.id === sentenceId);
    if (sentToDelete) {
      const cleanTarget = sentToDelete.targetSentence.trim();
      const deletedTargets = this.get<string[]>(STORAGE_KEYS.DELETED_SENTENCES, []);
      if (!deletedTargets.includes(cleanTarget)) {
        this.set(STORAGE_KEYS.DELETED_SENTENCES, [...deletedTargets, cleanTarget]);
      }
    }
    const updated = sentences.filter((s) => s.id !== sentenceId);
    this.saveSentences(updated);

    // Prune deleted sentenceId from custom lesson config
    const cfg = this.getLessonConfig();
    if (cfg.assemblySentenceIds?.includes(sentenceId) || cfg.speakingSentenceIds?.includes(sentenceId)) {
      const nextAsm = cfg.assemblySentenceIds?.filter((id) => id !== sentenceId);
      const nextSpk = cfg.speakingSentenceIds?.filter((id) => id !== sentenceId);
      this.saveLessonConfig({
        ...cfg,
        assemblySentenceIds: nextAsm && nextAsm.length > 0 ? nextAsm : undefined,
        speakingSentenceIds: nextSpk && nextSpk.length > 0 ? nextSpk : undefined,
      });
    }
    return true;
  }

  public resetSentencesToDefaults(): void {
    this.memoryCache.delete(STORAGE_KEYS.DELETED_SENTENCES);
    this.memoryCache.delete(STORAGE_KEYS.SENTENCES);
    if (this.isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.DELETED_SENTENCES);
      } catch {}
    }
    this.saveSentences(INITIAL_SENTENCES);
  }

  // Lesson Custom Config Management
  public getLessonConfig(): LessonCustomConfig {
    return this.get<LessonCustomConfig>(STORAGE_KEYS.LESSON_CONFIG, {});
  }

  public saveLessonConfig(config: LessonCustomConfig): void {
    this.set(STORAGE_KEYS.LESSON_CONFIG, config);
  }

  public getGameScores(): GameScores {
    const raw = this.get<Partial<GameScores>>(STORAGE_KEYS.GAME_SCORES, DEFAULT_GAME_SCORES);
    return {
      ...DEFAULT_GAME_SCORES,
      ...raw,
    };
  }

  public updateGameScores(partial: Partial<GameScores>): GameScores {
    const current = this.getGameScores();
    const next: GameScores = {
      blitzBestScore: Math.max(current.blitzBestScore, partial.blitzBestScore ?? 0),
      blitzBestCombo: Math.max(current.blitzBestCombo, partial.blitzBestCombo ?? 0),
      matchBestScore: Math.max(current.matchBestScore, partial.matchBestScore ?? 0),
      matchBestWaves: Math.max(current.matchBestWaves, partial.matchBestWaves ?? 0),
      runnerBestScore: Math.max(current.runnerBestScore, partial.runnerBestScore ?? 0),
      runnerBestDistance: Math.max(current.runnerBestDistance, partial.runnerBestDistance ?? 0),
      totalGamesPlayed: current.totalGamesPlayed + (partial.totalGamesPlayed ?? 1),
    };
    this.set(STORAGE_KEYS.GAME_SCORES, next);
    return next;
  }

  public resetLessonConfig(): void {
    this.memoryCache.delete(STORAGE_KEYS.LESSON_CONFIG);
    if (this.isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.LESSON_CONFIG);
      } catch {}
    }
  }

  public resetToDefaults(): void {
    this.clearMemoryCache();
    if (this.isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.WORDS);
        window.localStorage.removeItem(STORAGE_KEYS.FAVORITES);
        window.localStorage.removeItem(STORAGE_KEYS.STREAK);
        window.localStorage.removeItem(STORAGE_KEYS.SENTENCES);
        window.localStorage.removeItem(STORAGE_KEYS.LESSON_CONFIG);
        window.localStorage.removeItem(STORAGE_KEYS.CUSTOM_DICTIONARY);
        window.localStorage.removeItem(STORAGE_KEYS.MASTERED_FLASHCARDS);
        window.localStorage.removeItem(STORAGE_KEYS.DELETED_WORDS);
        window.localStorage.removeItem(STORAGE_KEYS.DELETED_SENTENCES);
        window.localStorage.removeItem(STORAGE_KEYS.GAME_SCORES);
      } catch {}
    }
  }

  public exportBackup(): string {
    const data = {
      version: 2,
      timestamp: Date.now(),
      words: this.getWords(),
      sentences: this.getSentences(),
      customDictionary: this.getCustomDictionaryWords(),
      lessonConfig: this.getLessonConfig(),
    };
    return JSON.stringify(data, null, 2);
  }

  public getDeletedWords(): string[] {
    return this.get<string[]>(STORAGE_KEYS.DELETED_WORDS, []);
  }

  public getDeletedSentences(): string[] {
    return this.get<string[]>(STORAGE_KEYS.DELETED_SENTENCES, []);
  }

  public getStreakDetails(): StreakDetails {
    const today = this.getTodayDateStr();
    const raw = this.get<StreakDetails | null>(STORAGE_KEYS.STREAK_DETAILS, null);
    if (!raw) {
      const legacyVal = this.get<number>(STORAGE_KEYS.STREAK, 1);
      const initialStreak = Math.max(1, legacyVal);
      const initialDetails: StreakDetails = {
        currentStreak: initialStreak,
        bestStreak: initialStreak,
        lastActiveDate: today,
        freezeCount: 1, // Tặng 1 Khiên bảo vệ chuỗi chào mừng
        shieldUsedToday: false,
        history: [today],
      };
      this.set(STORAGE_KEYS.STREAK_DETAILS, initialDetails, false);
      return initialDetails;
    }

    const days = this.getDaysDiff(raw.lastActiveDate, today);
    if (days === 0) {
      return raw;
    } else if (days === 1) {
      return { ...raw, shieldUsedToday: false };
    } else if (days === 2) {
      // Lỡ 1 ngày: Tự động kích hoạt Khiên bảo vệ chuỗi nếu có
      if (raw.freezeCount > 0 && !raw.shieldUsedToday) {
        const updated: StreakDetails = {
          ...raw,
          freezeCount: raw.freezeCount - 1,
          shieldUsedToday: true,
          lastActiveDate: today,
        };
        this.set(STORAGE_KEYS.STREAK_DETAILS, updated, false);
        return updated;
      } else {
        const updated: StreakDetails = {
          ...raw,
          currentStreak: 0,
          shieldUsedToday: false,
        };
        this.set(STORAGE_KEYS.STREAK_DETAILS, updated, false);
        this.set(STORAGE_KEYS.STREAK, 0, false);
        return updated;
      }
    } else {
      const updated: StreakDetails = {
        ...raw,
        currentStreak: 0,
        shieldUsedToday: false,
      };
      this.set(STORAGE_KEYS.STREAK_DETAILS, updated, false);
      this.set(STORAGE_KEYS.STREAK, 0, false);
      return updated;
    }
  }

  public recordStudyActivity(): { streak: number; increased: boolean; shieldUsed: boolean } {
    const today = this.getTodayDateStr();
    const details = this.getStreakDetails();
    if (details.lastActiveDate === today && details.currentStreak > 0) {
      return { streak: details.currentStreak, increased: false, shieldUsed: details.shieldUsedToday };
    }

    const nextStreak = details.currentStreak <= 0 ? 1 : details.currentStreak + 1;
    const nextBest = Math.max(details.bestStreak, nextStreak);
    // Cứ mỗi 7 ngày học liên tục được nhận 1 Khiên bảo vệ (tối đa dự trữ 2 khiên)
    let nextFreeze = details.freezeCount;
    if (nextStreak % 7 === 0 && nextFreeze < 2) {
      nextFreeze += 1;
    }

    const nextHistory = Array.from(new Set([...details.history, today])).slice(-30);
    const updated: StreakDetails = {
      currentStreak: nextStreak,
      bestStreak: nextBest,
      lastActiveDate: today,
      freezeCount: nextFreeze,
      shieldUsedToday: false,
      history: nextHistory,
    };

    this.set(STORAGE_KEYS.STREAK_DETAILS, updated, false);
    this.set(STORAGE_KEYS.STREAK, nextStreak, true);
    return { streak: nextStreak, increased: true, shieldUsed: false };
  }

  private getTodayDateStr(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getDaysDiff(dateStr1: string, dateStr2: string): number {
    if (!dateStr1 || !dateStr2) return 999;
    try {
      const d1 = new Date(dateStr1 + 'T00:00:00');
      const d2 = new Date(dateStr2 + 'T00:00:00');
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      return Math.round(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 999;
    }
  }

  public getStreak(): number {
    return this.getStreakDetails().currentStreak;
  }

  public applyCloudProfile(remote: any, mode: 'merge' | 'replace'): void {
    if (!remote || typeof remote !== 'object') return;
    this.suppressMutationNotify = true;

    try {
      const builtInIdSet = new Set(INITIAL_WORDS.map((w) => w.id));
      const builtInSentIdSet = new Set(INITIAL_SENTENCES.map((s) => s.id));

      // 1. Deleted built-in tombstones
      const remoteDelWords: string[] = Array.isArray(remote.deleted_builtins?.words)
        ? remote.deleted_builtins.words
        : [];
      const remoteDelSents: string[] = Array.isArray(remote.deleted_builtins?.sentences)
        ? remote.deleted_builtins.sentences
        : [];

      const finalDelWords =
        mode === 'replace'
          ? Array.from(new Set(remoteDelWords))
          : Array.from(new Set([...this.getDeletedWords(), ...remoteDelWords]));
      const finalDelSents =
        mode === 'replace'
          ? Array.from(new Set(remoteDelSents))
          : Array.from(new Set([...this.getDeletedSentences(), ...remoteDelSents]));

      this.set(STORAGE_KEYS.DELETED_WORDS, finalDelWords, false);
      this.set(STORAGE_KEYS.DELETED_SENTENCES, finalDelSents, false);

      const delWordSet = new Set(finalDelWords.map((h) => h.trim()));
      const delSentSet = new Set(finalDelSents.map((t) => t.trim()));

      // 2. Hydrate built-in HSK1 words + SRS progress + Custom words
      const localWords = this.getWords();
      const localById = new Map(localWords.map((w) => [w.id, w]));
      const srsMap: Record<string, BuiltInSrsProgress> =
        remote.srs_progress && typeof remote.srs_progress === 'object' ? remote.srs_progress : {};

      const hydratedBuiltIns: ChineseWord[] = [];
      for (const bw of INITIAL_WORDS) {
        if (delWordSet.has(bw.hanzi.trim())) continue;
        const loc = localById.get(bw.id);
        const rem = srsMap[bw.id];

        if (mode === 'replace') {
          hydratedBuiltIns.push({
            ...bw,
            box: rem?.box ?? 1,
            lastReviewed: rem?.t,
          });
        } else {
          const locBox = loc?.box ?? 1;
          const remBox = rem?.box ?? 1;
          const locTime = loc?.lastReviewed ?? 0;
          const remTime = rem?.t ?? 0;
          hydratedBuiltIns.push({
            ...bw,
            box: Math.max(locBox, remBox),
            lastReviewed: Math.max(locTime, remTime) || undefined,
          });
        }
      }

      const remoteCustomWords: ChineseWord[] = Array.isArray(remote.custom_words)
        ? remote.custom_words
        : [];
      const localCustomWords =
        mode === 'merge' ? localWords.filter((w) => !builtInIdSet.has(w.id)) : [];

      const customWordByHanzi = new Map<string, ChineseWord>();
      const builtInHanziSet = new Set(hydratedBuiltIns.map((w) => w.hanzi.trim()));

      for (const cw of [...remoteCustomWords, ...localCustomWords]) {
        if (!cw || !cw.hanzi) continue;
        const h = cw.hanzi.trim();
        if (!h || builtInHanziSet.has(h) || delWordSet.has(h)) continue;
        if (!customWordByHanzi.has(h)) {
          customWordByHanzi.set(h, cw);
        }
      }

      const finalWords = [...customWordByHanzi.values(), ...hydratedBuiltIns];
      this.set(STORAGE_KEYS.WORDS, finalWords, false);

      // 3. Mastered Flashcards
      const validWordIds = new Set(finalWords.map((w) => w.id));
      const remoteMastered: string[] = Array.isArray(remote.mastered_flashcard_ids)
        ? remote.mastered_flashcard_ids
        : [];
      const mergedMastered =
        mode === 'replace'
          ? remoteMastered.filter((id) => validWordIds.has(id))
          : Array.from(
              new Set([...this.getMasteredFlashcardIds(), ...remoteMastered])
            ).filter((id) => validWordIds.has(id));
      this.set(STORAGE_KEYS.MASTERED_FLASHCARDS, mergedMastered, false);

      // 4. Custom Dictionary
      const remoteCustomDict: ChineseWord[] = Array.isArray(remote.custom_dictionary)
        ? remote.custom_dictionary
        : [];
      const localCustomDict = mode === 'merge' ? this.getCustomDictionaryWords() : [];
      const dictByHanzi = new Map<string, ChineseWord>();
      for (const dw of [...remoteCustomDict, ...localCustomDict]) {
        if (!dw || !dw.hanzi) continue;
        const h = dw.hanzi.trim();
        if (h && !dictByHanzi.has(h)) {
          dictByHanzi.set(h, dw);
        }
      }
      this.set(STORAGE_KEYS.CUSTOM_DICTIONARY, Array.from(dictByHanzi.values()), false);
      this.cachedMergedDictionary = null;

      // 5. Sentences (built-ins + custom sentences)
      const localSentences = this.getSentences();
      const remoteCustomSents: SentenceExercise[] = Array.isArray(remote.custom_sentences)
        ? remote.custom_sentences
        : [];
      const localCustomSents =
        mode === 'merge' ? localSentences.filter((s) => !builtInSentIdSet.has(s.id)) : [];

      const hydratedBuiltInSents = INITIAL_SENTENCES.filter(
        (s) => !delSentSet.has(s.targetSentence.trim())
      );
      const builtInSentTargets = new Set(hydratedBuiltInSents.map((s) => s.targetSentence.trim()));
      const customSentByTarget = new Map<string, SentenceExercise>();

      for (const cs of [...remoteCustomSents, ...localCustomSents]) {
        if (!cs || !cs.targetSentence) continue;
        const t = cs.targetSentence.trim();
        if (!t || builtInSentTargets.has(t) || delSentSet.has(t)) continue;
        if (!customSentByTarget.has(t)) {
          customSentByTarget.set(t, cs);
        }
      }

      const finalSentences = [...customSentByTarget.values(), ...hydratedBuiltInSents];
      this.set(STORAGE_KEYS.SENTENCES, finalSentences, false);
      const validSentIds = new Set(finalSentences.map((s) => s.id));

      // 6. Lesson Config
      const remoteCfg: LessonCustomConfig =
        remote.lesson_config && typeof remote.lesson_config === 'object'
          ? remote.lesson_config
          : {};
      const localCfg = this.getLessonConfig();
      const chosenCfg =
        mode === 'replace'
          ? remoteCfg
          : Object.keys(localCfg).length > 0
          ? localCfg
          : remoteCfg;

      const sanitizeIds = (arr: string[] | undefined, validSet: Set<string>) => {
        if (!Array.isArray(arr) || arr.length === 0) return undefined;
        const clean = arr.filter((id) => validSet.has(id));
        return clean.length > 0 ? clean : undefined;
      };

      this.set(
        STORAGE_KEYS.LESSON_CONFIG,
        {
          flashcardWordIds: sanitizeIds(chosenCfg.flashcardWordIds, validWordIds),
          writingWordIds: sanitizeIds(chosenCfg.writingWordIds, validWordIds),
          assemblySentenceIds: sanitizeIds(chosenCfg.assemblySentenceIds, validSentIds),
          speakingSentenceIds: sanitizeIds(chosenCfg.speakingSentenceIds, validSentIds),
        },
        false
      );

      // 7. Game High Scores & Streak
      const localGs = this.getGameScores();
      const remGs: Partial<GameScores> =
        remote.high_scores && typeof remote.high_scores === 'object' ? remote.high_scores : {};
      const nextGs: GameScores =
        mode === 'replace'
          ? {
              blitzBestScore: remGs.blitzBestScore ?? 0,
              blitzBestCombo: remGs.blitzBestCombo ?? 0,
              matchBestScore: remGs.matchBestScore ?? 0,
              matchBestWaves: remGs.matchBestWaves ?? 0,
              runnerBestScore: remGs.runnerBestScore ?? 0,
              runnerBestDistance: remGs.runnerBestDistance ?? 0,
              totalGamesPlayed: remGs.totalGamesPlayed ?? 0,
            }
          : {
              blitzBestScore: Math.max(localGs.blitzBestScore, remGs.blitzBestScore ?? 0),
              blitzBestCombo: Math.max(localGs.blitzBestCombo, remGs.blitzBestCombo ?? 0),
              matchBestScore: Math.max(localGs.matchBestScore, remGs.matchBestScore ?? 0),
              matchBestWaves: Math.max(localGs.matchBestWaves, remGs.matchBestWaves ?? 0),
              runnerBestScore: Math.max(localGs.runnerBestScore, remGs.runnerBestScore ?? 0),
              runnerBestDistance: Math.max(localGs.runnerBestDistance, remGs.runnerBestDistance ?? 0),
              totalGamesPlayed: Math.max(localGs.totalGamesPlayed, remGs.totalGamesPlayed ?? 0),
            };
      this.set(STORAGE_KEYS.GAME_SCORES, nextGs, false);

      if (typeof remote.streak === 'number') {
        const nextStreak =
          mode === 'replace' ? remote.streak : Math.max(this.getStreak(), remote.streak);
        this.set(STORAGE_KEYS.STREAK, nextStreak, false);
        const details = this.getStreakDetails();
        this.set(
          STORAGE_KEYS.STREAK_DETAILS,
          {
            ...details,
            currentStreak: nextStreak,
            bestStreak: Math.max(details.bestStreak, nextStreak),
          },
          false
        );
      }
    } finally {
      this.suppressMutationNotify = false;
    }
  }

  public importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      this.clearMemoryCache();
      if (Array.isArray(parsed.words)) {
        this.saveWords(parsed.words);
      }
      if (Array.isArray(parsed.sentences)) {
        this.saveSentences(parsed.sentences);
      }
      if (Array.isArray(parsed.customDictionary)) {
        this.set(STORAGE_KEYS.CUSTOM_DICTIONARY, parsed.customDictionary);
      }
      if (parsed.lessonConfig) {
        this.saveLessonConfig(parsed.lessonConfig);
      }
      return true;
    } catch {
      return false;
    }
  }
}

export const storageService = new SafeStorageService();
