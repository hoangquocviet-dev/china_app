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
  type: 'assembly' | 'translation';
  sourceLang: 'zh' | 'vi';
  targetLang: 'vi' | 'zh';
  sourceSentence: string;
  pinyin?: string;
  targetSentence: string;
  tokens: string[]; // Các mảnh ghép chuẩn
  distractorTokens?: string[]; // Mảnh ghép gây nhiễu
  acceptableAnswers?: string[]; // Các biến thể dịch chấp nhận được
  grammarNote?: string;
}

export type ActiveTab = 'flashcard' | 'writing' | 'assembly' | 'translation' | 'library';
