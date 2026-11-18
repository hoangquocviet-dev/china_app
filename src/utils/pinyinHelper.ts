import type { ChineseWord, SentenceExercise } from '../types';

/**
 * Pinyin & Search Helper Utilities
 * - Ensures all Pinyin strings are canonical NFC precomposed Unicode
 * - Provides smart search matching (handles toneless Pinyin, space variations, and unaccented Vietnamese)
 */
export function formatPinyin(pinyin: string): string {
  if (!pinyin) return '';
  return pinyin.normalize('NFC').trim();
}

export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[üÜ]/g, 'u')
    .toLowerCase()
    .trim();
}

export function matchesWordSearch(word: ChineseWord, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  // Direct includes check
  if (
    word.hanzi.includes(q) ||
    word.pinyin.toLowerCase().includes(q) ||
    word.meaning.toLowerCase().includes(q) ||
    (word.hanviet && word.hanviet.toLowerCase().includes(q))
  ) {
    return true;
  }

  // Normalized search (strips tones, accents, and space variations)
  const normQ = normalizeSearchText(q);
  if (!normQ) return false;

  const normPinyin = normalizeSearchText(word.pinyin);
  const normMeaning = normalizeSearchText(word.meaning);
  const normHanviet = normalizeSearchText(word.hanviet || '');

  if (
    normPinyin.includes(normQ) ||
    normMeaning.includes(normQ) ||
    normHanviet.includes(normQ)
  ) {
    return true;
  }

  // Also match without spaces (e.g. "nihao" matches "nǐ hǎo", "caphe" matches "cà phê")
  const normQNoSpace = normQ.replace(/\s+/g, '');
  if (normQNoSpace.length >= 2) {
    const pinyinNoSpace = normPinyin.replace(/\s+/g, '');
    const meaningNoSpace = normMeaning.replace(/\s+/g, '');
    const hanvietNoSpace = normHanviet.replace(/\s+/g, '');
    if (
      pinyinNoSpace.includes(normQNoSpace) ||
      meaningNoSpace.includes(normQNoSpace) ||
      hanvietNoSpace.includes(normQNoSpace)
    ) {
      return true;
    }
  }

  return false;
}

export function matchesSentenceSearch(sentence: SentenceExercise, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  if (
    sentence.targetSentence.includes(q) ||
    (sentence.pinyin && sentence.pinyin.toLowerCase().includes(q)) ||
    sentence.sourceSentence.toLowerCase().includes(q)
  ) {
    return true;
  }

  const normQ = normalizeSearchText(q);
  if (!normQ) return false;

  const normTarget = normalizeSearchText(sentence.targetSentence);
  const normPinyin = normalizeSearchText(sentence.pinyin || '');
  const normSource = normalizeSearchText(sentence.sourceSentence);

  if (
    normTarget.includes(normQ) ||
    normPinyin.includes(normQ) ||
    normSource.includes(normQ)
  ) {
    return true;
  }

  const normQNoSpace = normQ.replace(/\s+/g, '');
  if (normQNoSpace.length >= 2) {
    const pinyinNoSpace = normPinyin.replace(/\s+/g, '');
    const sourceNoSpace = normSource.replace(/\s+/g, '');
    if (
      pinyinNoSpace.includes(normQNoSpace) ||
      sourceNoSpace.includes(normQNoSpace)
    ) {
      return true;
    }
  }

  return false;
}
