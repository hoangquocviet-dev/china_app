import type { ChineseWord, SentenceExercise } from '../types';

/**
 * Pinyin & Search Helper Utilities
 * - Ensures all Pinyin strings are canonical NFC precomposed Unicode
 * - Provides smart fuzzy search matching (handles toneless Pinyin, space variations, and unaccented Vietnamese)
 * - Optimized with high-performance WeakMap caches to make large dictionary searches (<1ms) instantaneous
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

interface WordSearchIndex {
  normPinyin: string;
  normMeaning: string;
  normHanviet: string;
  pinyinNoSpace: string;
  meaningNoSpace: string;
  hanvietNoSpace: string;
}

interface SentenceSearchIndex {
  normTarget: string;
  normPinyin: string;
  normSource: string;
  pinyinNoSpace: string;
  sourceNoSpace: string;
}

const wordIndexCache = new WeakMap<ChineseWord, WordSearchIndex>();
const sentenceIndexCache = new WeakMap<SentenceExercise, SentenceSearchIndex>();

function getWordSearchIndex(word: ChineseWord): WordSearchIndex {
  let idx = wordIndexCache.get(word);
  if (!idx) {
    const normPinyin = normalizeSearchText(word.pinyin);
    const normMeaning = normalizeSearchText(word.meaning);
    const normHanviet = normalizeSearchText(word.hanviet || '');
    idx = {
      normPinyin,
      normMeaning,
      normHanviet,
      pinyinNoSpace: normPinyin.replace(/\s+/g, ''),
      meaningNoSpace: normMeaning.replace(/\s+/g, ''),
      hanvietNoSpace: normHanviet.replace(/\s+/g, ''),
    };
    wordIndexCache.set(word, idx);
  }
  return idx;
}

function getSentenceSearchIndex(sentence: SentenceExercise): SentenceSearchIndex {
  let idx = sentenceIndexCache.get(sentence);
  if (!idx) {
    const normTarget = normalizeSearchText(sentence.targetSentence);
    const normPinyin = normalizeSearchText(sentence.pinyin || '');
    const normSource = normalizeSearchText(sentence.sourceSentence);
    idx = {
      normTarget,
      normPinyin,
      normSource,
      pinyinNoSpace: normPinyin.replace(/\s+/g, ''),
      sourceNoSpace: normSource.replace(/\s+/g, ''),
    };
    sentenceIndexCache.set(sentence, idx);
  }
  return idx;
}

export function matchesWordSearch(word: ChineseWord, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  // 1. Direct match (Fast-path)
  if (
    word.hanzi.includes(q) ||
    word.pinyin.toLowerCase().includes(q) ||
    word.meaning.toLowerCase().includes(q) ||
    (word.hanviet && word.hanviet.toLowerCase().includes(q))
  ) {
    return true;
  }

  // 2. Normalized search using cached pre-indexed word fields
  const normQ = normalizeSearchText(q);
  if (!normQ) return false;

  const idx = getWordSearchIndex(word);

  if (
    idx.normPinyin.includes(normQ) ||
    idx.normMeaning.includes(normQ) ||
    idx.normHanviet.includes(normQ)
  ) {
    return true;
  }

  // 3. Space-agnostic fuzzy matching (e.g. "nihao" -> "nǐ hǎo", "caphe" -> "cà phê")
  const normQNoSpace = normQ.replace(/\s+/g, '');
  if (normQNoSpace.length >= 2) {
    if (
      idx.pinyinNoSpace.includes(normQNoSpace) ||
      idx.meaningNoSpace.includes(normQNoSpace) ||
      idx.hanvietNoSpace.includes(normQNoSpace)
    ) {
      return true;
    }
  }

  return false;
}

export function matchesSentenceSearch(sentence: SentenceExercise, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  // 1. Direct match (Fast-path)
  if (
    sentence.targetSentence.includes(q) ||
    (sentence.pinyin && sentence.pinyin.toLowerCase().includes(q)) ||
    sentence.sourceSentence.toLowerCase().includes(q)
  ) {
    return true;
  }

  // 2. Normalized search using cached pre-indexed sentence fields
  const normQ = normalizeSearchText(q);
  if (!normQ) return false;

  const idx = getSentenceSearchIndex(sentence);

  if (
    idx.normTarget.includes(normQ) ||
    idx.normPinyin.includes(normQ) ||
    idx.normSource.includes(normQ)
  ) {
    return true;
  }

  // 3. Space-agnostic fuzzy matching
  const normQNoSpace = normQ.replace(/\s+/g, '');
  if (normQNoSpace.length >= 2) {
    if (
      idx.pinyinNoSpace.includes(normQNoSpace) ||
      idx.sourceNoSpace.includes(normQNoSpace)
    ) {
      return true;
    }
  }

  return false;
}
