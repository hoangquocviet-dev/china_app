import { INITIAL_WORDS } from '../data/hsk1Words';
import type { ChineseWord } from '../types';

const STORAGE_KEYS = {
  WORDS: 'hanziflow_words',
  FAVORITES: 'hanziflow_favorites',
  ACTIVE_TAB: 'hanziflow_active_tab',
  STREAK: 'hanziflow_streak',
  BACKUP: 'hanziflow_backup',
};

class SafeStorageService {
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
    if (!this.isLocalStorageAvailable()) return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`[Storage] Failed to parse key: ${key}. Backing up and falling back.`, e);
      try {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          window.localStorage.setItem(`${STORAGE_KEYS.BACKUP}_corrupted_${Date.now()}`, raw);
        }
      } catch {}
      return fallback;
    }
  }

  private set<T>(key: string, value: T): boolean {
    if (!this.isLocalStorageAvailable()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[Storage] Failed to save key: ${key}`, e);
      return false;
    }
  }

  public getWords(): ChineseWord[] {
    const words = this.get<ChineseWord[]>(STORAGE_KEYS.WORDS, []);
    if (!words || words.length === 0) {
      this.set(STORAGE_KEYS.WORDS, INITIAL_WORDS);
      return INITIAL_WORDS;
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
    return { success: true, message: `Đã thêm thành công "${cleanHanzi}" vào sổ từ!`, word: newWord };
  }

  public deleteWord(wordId: string): boolean {
    const words = this.getWords();
    const updated = words.filter((w) => w.id !== wordId);
    this.saveWords(updated);
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

  public resetToDefaults(): void {
    if (this.isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.WORDS);
        window.localStorage.removeItem(STORAGE_KEYS.FAVORITES);
        window.localStorage.removeItem(STORAGE_KEYS.STREAK);
      } catch {}
    }
  }

  public exportBackup(): string {
    const data = {
      version: 1,
      timestamp: Date.now(),
      words: this.getWords(),
    };
    return JSON.stringify(data, null, 2);
  }

  public importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.words)) {
        this.saveWords(parsed.words);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const storageService = new SafeStorageService();
