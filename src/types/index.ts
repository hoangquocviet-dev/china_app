export interface ExampleSentence {
  zh: string;
  pinyin: string;
  vi: string;
}

export interface ChineseWord {
  id: string;
  hanzi: string;
  pinyin: string;
  hanviet: string;
  meaning: string;
  pos: string; // Từ loại: Động từ, Danh từ, v.v.
  level: 'HSK1' | 'HSK2' | 'HSK3' | 'TOPIC';
  radical?: string; // Bộ thủ
  strokeCount?: number;
  examples: ExampleSentence[];
  box?: number; // 1-5 for SRS Leitner
  lastReviewed?: number;
}

export interface SentenceExercise {
  id: string;
  type?: 'assembly' | 'translation' | 'speaking' | 'custom';
  sourceLang: 'zh' | 'vi';
  targetLang: 'vi' | 'zh';
  sourceSentence: string;
  pinyin?: string;
  targetSentence: string;
  tokens: string[]; // Các mảnh ghép chuẩn
  distractorTokens?: string[]; // Mảnh ghép gây nhiễu
  acceptableAnswers?: string[]; // Các biến thể dịch chấp nhận được
  grammarNote?: string;
  isCustom?: boolean;
  includeInAssembly?: boolean;
  includeInSpeaking?: boolean;
}

export interface LessonCustomConfig {
  flashcardWordIds?: string[]; // IDs của từ vựng hiển thị trong Flashcard
  writingWordIds?: string[];   // IDs của từ vựng hiển thị trong Luyện viết
  assemblySentenceIds?: string[]; // IDs của câu hiển thị trong Ghép câu
  speakingSentenceIds?: string[]; // IDs của câu hiển thị trong Luyện nói
}

export type ActiveTab = 'flashcard' | 'writing' | 'assembly' | 'speaking' | 'games' | 'library';

export type MiniGameId = 'blitz' | 'match' | 'runner' | 'exam' | 'tone';

export interface GameScores {
  blitzBestScore: number;
  blitzBestCombo: number;
  matchBestScore: number;
  matchBestWaves: number;
  runnerBestScore: number;
  runnerBestDistance: number;
  totalGamesPlayed: number;
}

export interface BuiltInSrsProgress {
  box: number;
  t?: number;
}

export interface HanziLeaderboardEntry {
  player_tag: string;
  nickname: string;
  blitz_score: number;
  match_score: number;
  runner_score: number;
  runner_distance: number;
  total_score: number;
  mastered_count: number;
  updated_at: string;
}

export interface CommunityWordRow {
  id: string;
  author_tag: string;
  author_name: string;
  hanzi: string;
  pinyin: string;
  hanviet: string;
  meaning: string;
  pos: string;
  level: 'HSK1' | 'HSK2' | 'HSK3' | 'TOPIC';
  examples: ExampleSentence[];
  updated_at: string;
}

export interface StreakDetails {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  freezeCount: number; // 0, 1, or 2
  shieldUsedToday: boolean;
  history: string[]; // ['2026-11-20', '2026-11-26']
}

