/**
 * Pinyin Helper Utilities
 * Ensures all Pinyin strings are canonical NFC precomposed Unicode,
 * preventing decomposed accents from detaching or floating over spaces.
 */
export function formatPinyin(pinyin: string): string {
  if (!pinyin) return '';
  return pinyin.normalize('NFC').trim();
}
