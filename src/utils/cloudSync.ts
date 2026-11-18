import { INITIAL_WORDS } from '../data/hsk1Words';
import { INITIAL_SENTENCES } from '../data/hsk1Sentences';
import type {
  BuiltInSrsProgress,
  ChineseWord,
  CommunityWordRow,
  HanziLeaderboardEntry,
  SentenceExercise,
} from '../types';
import { storageService } from './storage';

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://eecfteeivqwkgzeezcfm.supabase.co';

const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  'sb_publishable_8WC_in4KQdELt8WD2npIhQ_Kw3WCu9A';

const SYNC_CODE_STORAGE_KEY = 'hanziflow_sync_code';
const NICKNAME_STORAGE_KEY = 'hanziflow_nickname';
const LAST_SYNCED_AT_KEY = 'hanziflow_last_synced_at';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 unambiguous chars (no 0/O/1/I)
const SYNC_CODE_REGEX = /^HF-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface SyncStateSnapshot {
  syncCode: string;
  nickname: string;
  status: SyncStatus;
  lastSyncedAt: number | null;
  errorMessage?: string;
}

export interface RestoreOutcome {
  ok: boolean;
  message: string;
  masteredCount?: number;
  customWordsCount?: number;
  totalScore?: number;
}

function generateSyncCode(): string {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let chars = '';
  for (let i = 0; i < 8; i++) {
    chars += ALPHABET[bytes[i] & 31];
  }
  return `HF-${chars.slice(0, 4)}-${chars.slice(4, 8)}`;
}

export function normalizeSyncCode(raw: string): string | null {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let body = cleaned;
  if (cleaned.startsWith('HF') && cleaned.length === 10) {
    body = cleaned.slice(2);
  }
  if (body.length !== 8) return null;
  const formatted = `HF-${body.slice(0, 4)}-${body.slice(4, 8)}`;
  return SYNC_CODE_REGEX.test(formatted) ? formatted : null;
}

export async function computePlayerTag(syncCode: string): Promise<string> {
  const encoded = new TextEncoder().encode(syncCode.trim().toUpperCase());
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const BUILTIN_WORD_IDS = new Set(INITIAL_WORDS.map((w) => w.id));
const BUILTIN_SENTENCE_IDS = new Set(INITIAL_SENTENCES.map((s) => s.id));

class CloudSyncManager {
  private status: SyncStatus = 'idle';
  private errorMessage: string | undefined;
  private debounceTimer: number | null = null;
  private pendingPush = false;
  private listeners = new Set<() => void>();
  private initialized = false;

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const fn of this.listeners) {
      try {
        fn();
      } catch {}
    }
  }

  public getSyncCode(): string {
    if (typeof window === 'undefined') return 'HF-AAAA-2222';
    try {
      const saved = window.localStorage.getItem(SYNC_CODE_STORAGE_KEY);
      if (saved && SYNC_CODE_REGEX.test(saved)) {
        return saved;
      }
      const created = generateSyncCode();
      window.localStorage.setItem(SYNC_CODE_STORAGE_KEY, created);
      return created;
    } catch {
      return generateSyncCode();
    }
  }

  public getNickname(): string {
    if (typeof window === 'undefined') return '';
    try {
      return window.localStorage.getItem(NICKNAME_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  }

  public setNickname(name: string): void {
    const clean = name.trim().slice(0, 32);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(NICKNAME_STORAGE_KEY, clean);
      } catch {}
    }
    this.emit();
    this.schedulePush();
  }

  public getLastSyncedAt(): number | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = Number(window.localStorage.getItem(LAST_SYNCED_AT_KEY) || '0');
      return raw > 0 ? raw : null;
    } catch {
      return null;
    }
  }

  private setLastSyncedAt(ts: number): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LAST_SYNCED_AT_KEY, String(ts));
      } catch {}
    }
  }

  public getSnapshot(): SyncStateSnapshot {
    const syncedAt = this.getLastSyncedAt();
    return {
      syncCode: this.getSyncCode(),
      nickname: this.getNickname(),
      status: this.status === 'idle' && syncedAt ? 'synced' : this.status,
      lastSyncedAt: syncedAt,
      errorMessage: this.errorMessage,
    };
  }

  // Initialize auto-sync, community dictionary pull, & ?sync=HF-XXXX-XXXX QR magic link
  public async init(onRemoteHydrated: () => void): Promise<RestoreOutcome | null> {
    if (!this.initialized && typeof window !== 'undefined') {
      this.initialized = true;
      this.getSyncCode();

      storageService.subscribeMutations(() => {
        this.schedulePush();
      });

      storageService.registerCommunityWordHook((word) => {
        void this.publishCommunityWord(word);
      });

      const flushOnHide = () => {
        if (this.pendingPush) {
          void this.pushNow(false, true);
        }
      };
      window.addEventListener('pagehide', flushOnHide);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) flushOnHide();
      });
    }

    // Pull global community dictionary words in background so all devices share newly added words
    void this.pullCommunityWords().then((updated) => {
      if (updated) onRemoteHydrated();
    });

    // 1. Check URL magic QR parameter (?sync=HF-XXXX-XXXX)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('sync');
      if (urlCode) {
        const normalized = normalizeSyncCode(urlCode);
        if (normalized) {
          try {
            window.localStorage.setItem(SYNC_CODE_STORAGE_KEY, normalized);
          } catch {}
        }
        params.delete('sync');
        const cleanQuery = params.toString();
        const cleanUrl =
          window.location.pathname + (cleanQuery ? `?${cleanQuery}` : '') + window.location.hash;
        window.history.replaceState({}, '', cleanUrl);

        const outcome = await this.restoreFromCode(urlCode);
        if (outcome.ok) {
          onRemoteHydrated();
        }
        return outcome;
      }
    }

    // 2. If this device previously synced, merge any newer updates from other devices
    if (this.getLastSyncedAt()) {
      const merged = await this.pullAndMerge();
      if (merged) {
        onRemoteHydrated();
      }
    }

    return null;
  }

  public schedulePush(): void {
    this.pendingPush = true;
    if (typeof window === 'undefined') return;
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = window.setTimeout(() => {
      this.debounceTimer = null;
      void this.pushNow(false, false);
    }, 1800);
  }

  private buildProfilePayload() {
    const syncCode = this.getSyncCode();
    const nickname = this.getNickname();
    const allWords = storageService.getWords();
    const allSentences = storageService.getSentences();
    const masteredIds = storageService.getMasteredFlashcardIds();
    const customDict = storageService.getCustomDictionaryWords();
    const deletedWords = storageService.getDeletedWords();
    const deletedSentences = storageService.getDeletedSentences();
    const lessonConfig = storageService.getLessonConfig();
    const highScores = storageService.getGameScores();

    const srsProgress: Record<string, BuiltInSrsProgress> = {};
    const customWords: ChineseWord[] = [];
    let srsActiveCount = 0;

    for (const w of allWords) {
      if (BUILTIN_WORD_IDS.has(w.id)) {
        if ((w.box && w.box > 1) || w.lastReviewed) {
          srsActiveCount++;
          srsProgress[w.id] = {
            box: w.box || 1,
            ...(w.lastReviewed ? { t: w.lastReviewed } : {}),
          };
        }
      } else {
        customWords.push(w);
      }
    }

    const customSentences: SentenceExercise[] = allSentences.filter(
      (s) => !BUILTIN_SENTENCE_IDS.has(s.id)
    );

    const totalScore =
      (highScores.blitzBestScore || 0) +
      (highScores.matchBestScore || 0) +
      (highScores.runnerBestScore || 0);

    const masteredCount = masteredIds.length;

    const hasMeaningfulActivity =
      srsActiveCount > 0 ||
      masteredCount > 0 ||
      customWords.length > 0 ||
      customSentences.length > 0 ||
      deletedWords.length > 0 ||
      deletedSentences.length > 0 ||
      totalScore > 0 ||
      nickname.trim().length > 0 ||
      Object.keys(lessonConfig).length > 0;

    return {
      hasMeaningfulActivity,
      totalScore,
      highScores,
      masteredCount,
      customDict,
      row: {
        sync_code: syncCode,
        nickname,
        srs_progress: srsProgress,
        mastered_flashcard_ids: masteredIds,
        custom_words: customWords,
        custom_dictionary: customDict,
        custom_sentences: customSentences,
        deleted_builtins: {
          words: deletedWords,
          sentences: deletedSentences,
        },
        lesson_config: lessonConfig,
        high_scores: highScores,
        mastered_count: masteredCount,
        streak: storageService.getStreak(),
        updated_at: new Date().toISOString(),
      },
    };
  }

  public async pushNow(force = false, keepalive = false): Promise<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return false;

    const payload = this.buildProfilePayload();
    if (!force && !payload.hasMeaningfulActivity && !this.getLastSyncedAt()) {
      this.pendingPush = false;
      return false;
    }

    const syncCode = payload.row.sync_code;
    this.status = 'syncing';
    this.errorMessage = undefined;
    this.emit();

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/hanzi_profiles?on_conflict=sync_code`, {
        method: 'POST',
        keepalive,
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
          'x-sync-code': syncCode,
        },
        body: JSON.stringify(payload.row),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      // Sync Arcade Leaderboard if player has scores, mastered words, or set a nickname
      if (
        payload.totalScore > 0 ||
        payload.masteredCount > 0 ||
        payload.row.nickname.trim().length > 0
      ) {
        const playerTag = await computePlayerTag(syncCode);
        const displayNick = payload.row.nickname.trim() || `Cao thủ ${syncCode.slice(-4)}`;
        await fetch(`${SUPABASE_URL}/rest/v1/hanzi_leaderboard?on_conflict=player_tag`, {
          method: 'POST',
          keepalive,
          headers: {
            apikey: SUPABASE_KEY,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal',
            'x-sync-code': syncCode,
          },
          body: JSON.stringify({
            player_tag: playerTag,
            nickname: displayNick,
            blitz_score: payload.highScores.blitzBestScore || 0,
            match_score: payload.highScores.matchBestScore || 0,
            runner_score: payload.highScores.runnerBestScore || 0,
            runner_distance: payload.highScores.runnerBestDistance || 0,
            mastered_count: payload.masteredCount,
            updated_at: new Date().toISOString(),
          }),
        }).catch(() => {});
      }

      // On explicit manual push, also ensure any local custom dictionary words are published to Cloud DB
      if (force && !keepalive && payload.customDict.length > 0) {
        for (const cw of payload.customDict.slice(0, 50)) {
          await this.publishCommunityWord(cw).catch(() => {});
        }
      }

      this.pendingPush = false;
      this.status = 'synced';
      this.setLastSyncedAt(Date.now());
      this.emit();
      return true;
    } catch (e) {
      this.status = 'error';
      this.errorMessage = e instanceof Error ? e.message : 'Lỗi kết nối Cloud';
      this.emit();
      return false;
    }
  }

  public async pullAndMerge(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
    const syncCode = this.getSyncCode();

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/hanzi_profiles?select=*&sync_code=eq.${encodeURIComponent(syncCode)}&limit=1`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            'x-sync-code': syncCode,
          },
        }
      );
      if (!res.ok) return false;
      const rows = await res.json();
      if (!Array.isArray(rows) || rows.length === 0) return false;

      const remote = rows[0];
      storageService.applyCloudProfile(remote, 'merge');
      if (remote.nickname && !this.getNickname()) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(NICKNAME_STORAGE_KEY, remote.nickname);
        }
      }
      this.status = 'synced';
      this.setLastSyncedAt(Date.now());
      this.emit();
      return true;
    } catch {
      return false;
    }
  }

  public async restoreFromCode(rawInput: string): Promise<RestoreOutcome> {
    const normalized = normalizeSyncCode(rawInput);
    if (!normalized) {
      return {
        ok: false,
        message: 'Mã ID chưa đúng định dạng (ví dụ hợp lệ: HF-8K3M-9P2X).',
      };
    }

    this.status = 'syncing';
    this.errorMessage = undefined;
    this.emit();

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/hanzi_profiles?select=*&sync_code=eq.${encodeURIComponent(normalized)}&limit=1`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            'x-sync-code': normalized,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const rows = await res.json();
      if (!Array.isArray(rows) || rows.length === 0) {
        this.status = 'idle';
        this.emit();
        return {
          ok: false,
          message:
            'Chưa tìm thấy dữ liệu trên Cloud cho mã này. Trên máy cũ, bạn hãy mở mục Đám mây và bấm "Đồng bộ lên Cloud ngay" trước nhé!',
        };
      }

      const remote = rows[0];
      storageService.applyCloudProfile(remote, 'replace');

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SYNC_CODE_STORAGE_KEY, normalized);
        window.localStorage.setItem(NICKNAME_STORAGE_KEY, remote.nickname || '');
      }

      this.pendingPush = false;
      this.status = 'synced';
      this.setLastSyncedAt(Date.now());
      this.emit();

      const hs = remote.high_scores || {};
      const totalScore =
        (hs.blitzBestScore || 0) + (hs.matchBestScore || 0) + (hs.runnerBestScore || 0);
      const customWordsCount = Array.isArray(remote.custom_words) ? remote.custom_words.length : 0;
      const masteredCount = Array.isArray(remote.mastered_flashcard_ids)
        ? remote.mastered_flashcard_ids.length
        : remote.mastered_count || 0;

      return {
        ok: true,
        masteredCount,
        customWordsCount,
        totalScore,
        message: `Khôi phục thành công mã ${normalized}! (${masteredCount} thẻ đã thuộc, ${customWordsCount} từ tự thêm, ${totalScore} điểm kỷ lục).`,
      };
    } catch (e) {
      console.error('[CloudSync] restore catch error:', e);
      this.status = 'error';
      this.emit();
      return {
        ok: false,
        message: 'Không kết nối được tới máy chủ Cloud. Vui lòng kiểm tra mạng và thử lại.',
      };
    }
  }

  // Fetch Top Arcade Leaderboard
  public async fetchLeaderboard(limit = 10): Promise<HanziLeaderboardEntry[]> {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/hanzi_leaderboard?select=*&order=total_score.desc,updated_at.desc&limit=${limit}`,
        {
          headers: { apikey: SUPABASE_KEY },
        }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? (data as HanziLeaderboardEntry[]) : [];
    } catch {
      return [];
    }
  }

  // Publish a newly added custom Chinese word to Global Community DB
  public async publishCommunityWord(word: ChineseWord): Promise<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
    const cleanHanzi = word.hanzi.trim().slice(0, 24);
    const cleanPinyin = word.pinyin.trim().slice(0, 100);
    const cleanMeaning = word.meaning.trim().slice(0, 300);
    if (!cleanHanzi || !cleanPinyin || !cleanMeaning) return false;

    try {
      const syncCode = this.getSyncCode();
      const authorTag = await computePlayerTag(syncCode);
      const authorName = this.getNickname().trim() || `Thành viên ${syncCode.slice(-4)}`;
      const rowId = `${authorTag.slice(0, 12)}_${cleanHanzi}`;
      const validLevel = ['HSK1', 'HSK2', 'HSK3', 'TOPIC'].includes(word.level)
        ? word.level
        : 'HSK1';

      const res = await fetch(`${SUPABASE_URL}/rest/v1/hanzi_community_words?on_conflict=id`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
          'x-sync-code': syncCode,
        },
        body: JSON.stringify({
          id: rowId,
          author_tag: authorTag,
          author_name: authorName,
          hanzi: cleanHanzi,
          pinyin: cleanPinyin,
          hanviet: (word.hanviet || '').trim().slice(0, 100),
          meaning: cleanMeaning,
          pos: (word.pos || 'Danh từ').trim().slice(0, 40),
          level: validLevel,
          examples: Array.isArray(word.examples) ? word.examples.slice(0, 3) : [],
          updated_at: new Date().toISOString(),
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Pull latest community-contributed Chinese words into Dictionary lookup
  public async pullCommunityWords(limit = 300): Promise<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/hanzi_community_words?select=*&order=updated_at.desc&limit=${limit}`,
        {
          headers: { apikey: SUPABASE_KEY },
        }
      );
      if (!res.ok) return false;
      const rows = (await res.json()) as CommunityWordRow[];
      if (!Array.isArray(rows) || rows.length === 0) return false;
      return storageService.mergeCommunityWordsIntoDictionary(rows);
    } catch {
      return false;
    }
  }
}

export const cloudSyncService = new CloudSyncManager();
