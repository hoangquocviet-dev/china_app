import type { ChineseWord } from '../types';

export type ExportFormat = 'csv' | 'tsv' | 'md' | 'json';

/**
 * Xuất danh sách từ vựng thành CSV chuẩn UTF-8 có BOM (\uFEFF)
 * Giúp Microsoft Excel trên Windows/Mac mở trực tiếp không bao giờ bị lỗi font tiếng Trung hay tiếng Việt.
 */
export function exportHanziCsv(words: ChineseWord[]): string {
  const BOM = '\uFEFF';
  const headers = ['Hán tự', 'Pinyin', 'Âm Hán Việt', 'Nghĩa', 'Từ loại', 'Cấp độ', 'Ví dụ tiếng Trung', 'Dịch câu ví dụ', 'Hộp SRS'];

  const rows = words.map((w) => {
    const eg = w.examples?.[0];
    const egZh = eg?.zh || '';
    const egVi = eg?.vi || '';
    return [
      `"${w.hanzi.replace(/"/g, '""')}"`,
      `"${w.pinyin.replace(/"/g, '""')}"`,
      `"${(w.hanviet || '').replace(/"/g, '""')}"`,
      `"${w.meaning.replace(/"/g, '""')}"`,
      `"${(w.pos || '').replace(/"/g, '""')}"`,
      `"${w.level || 'HSK1'}"`,
      `"${egZh.replace(/"/g, '""')}"`,
      `"${egVi.replace(/"/g, '""')}"`,
      `"${w.box || 1}"`,
    ].join(',');
  });

  return BOM + [headers.join(','), ...rows].join('\r\n');
}

/**
 * Xuất danh sách từ vựng thành TSV (Tab Separated Values)
 * Chuẩn import trực tiếp vào Anki decks và Quizlet flashcards.
 */
export function exportHanziTsv(words: ChineseWord[]): string {
  return words
    .map((w) => {
      const front = w.hanzi;
      const eg = w.examples?.[0];
      const egText = eg ? ` (VD: ${eg.zh} - ${eg.vi})` : '';
      const back = `${w.pinyin}${w.hanviet ? ` [${w.hanviet}]` : ''}: ${w.meaning}${egText}`;
      // Đảm bảo không chứa ký tự tab bên trong cột
      return `${front.replace(/\t/g, ' ')}\t${back.replace(/\t/g, ' ')}\t${w.level || 'HSK1'}`;
    })
    .join('\n');
}

/**
 * Xuất danh sách từ vựng thành Bảng Markdown (Cheatsheet)
 * Thích hợp dán vào Notion, Obsidian, GitHub README hoặc sổ tay markdown cá nhân.
 */
export function exportHanziMarkdown(words: ChineseWord[]): string {
  const header = '| Hán tự | Pinyin | Hán Việt | Nghĩa tiếng Việt | Cấp độ | Câu ví dụ |\n| :--- | :--- | :--- | :--- | :---: | :--- |';
  const rows = words.map((w) => {
    const eg = w.examples?.[0];
    const egStr = eg ? `${eg.zh} (${eg.vi})` : '-';
    return `| **${w.hanzi}** | ${w.pinyin} | ${w.hanviet || '-'} | ${w.meaning} | ${w.level || 'HSK1'} | ${egStr} |`;
  });
  return [header, ...rows].join('\n');
}

/**
 * Xuất JSON dữ liệu từ vựng
 */
export function exportHanziJson(words: ChineseWord[]): string {
  return JSON.stringify(words, null, 2);
}

export interface ParseImportResult {
  words: ChineseWord[];
  skippedCount: number;
  format: 'json' | 'csv' | 'tsv' | 'lines';
  error?: string;
}

/**
 * Trình phân tích đa định dạng thông minh cho từ vựng tiếng Trung:
 * Tự động nhận diện JSON, CSV, TSV (Anki), hoặc danh sách dạng văn bản dòng.
 * Tự động tra cứu từ điển hệ thống để bù đắp Pinyin, Hán Việt và ví dụ cho các từ nhập vắn tắt.
 */
export function parseHanziImport(
  rawText: string,
  existingWords: ChineseWord[],
  dictionaryWords: ChineseWord[] = []
): ParseImportResult {
  const text = rawText.trim();
  if (!text) {
    return { words: [], skippedCount: 0, format: 'lines', error: 'Nội dung nhập đang để trống.' };
  }

  const existingHanziSet = new Set(existingWords.map((w) => w.hanzi.trim()));
  const dictMap = new Map<string, ChineseWord>();
  for (const dw of dictionaryWords) {
    dictMap.set(dw.hanzi.trim(), dw);
  }

  // 1. Thử phân tích JSON (nếu bắt đầu bằng [ hoặc {)
  if (text.startsWith('[') || text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      let rawList: any[] = [];
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (Array.isArray(parsed.words)) {
        rawList = parsed.words;
      }

      if (rawList.length > 0) {
        const words: ChineseWord[] = [];
        let skipped = 0;
        for (const item of rawList) {
          if (!item.hanzi || typeof item.hanzi !== 'string') {
            skipped++;
            continue;
          }
          const cleanHanzi = item.hanzi.trim();
          if (existingHanziSet.has(cleanHanzi)) {
            skipped++;
            continue;
          }

          const dictMatch = dictMap.get(cleanHanzi);
          const newWord: ChineseWord = {
            id: `import_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            hanzi: cleanHanzi,
            pinyin: (item.pinyin || dictMatch?.pinyin || '').trim(),
            hanviet: (item.hanviet || dictMatch?.hanviet || '').trim().toUpperCase(),
            meaning: (item.meaning || dictMatch?.meaning || cleanHanzi).trim(),
            pos: item.pos || dictMatch?.pos || 'Từ vựng',
            level: item.level || dictMatch?.level || 'HSK1',
            examples: Array.isArray(item.examples) && item.examples.length > 0 ? item.examples : dictMatch?.examples || [],
            box: 1,
            lastReviewed: Date.now(),
          };
          words.push(newWord);
          existingHanziSet.add(cleanHanzi);
        }
        return { words, skippedCount: skipped, format: 'json' };
      }
    } catch {
      // Tiếp tục thử các định dạng văn bản dòng khác nếu parse JSON lỗi
    }
  }

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) {
    return { words: [], skippedCount: 0, format: 'lines', error: 'Không tìm thấy dòng dữ liệu nào.' };
  }

  // 2. Kiểm tra TSV (Anki format: có chứa ký tự tab \t)
  const tabLineCount = lines.filter((l) => l.includes('\t')).length;
  if (tabLineCount >= Math.min(2, lines.length)) {
    const words: ChineseWord[] = [];
    let skipped = 0;
    for (const line of lines) {
      const parts = line.split('\t').map((p) => p.trim());
      const hanzi = parts[0];
      if (!hanzi || !/[\u3400-\u9fff]/.test(hanzi)) {
        skipped++;
        continue;
      }
      if (existingHanziSet.has(hanzi)) {
        skipped++;
        continue;
      }

      const dictMatch = dictMap.get(hanzi);
      const detail = parts[1] || '';
      // Phân tách pinyin, hanviet, meaning nếu có dạng "pinyin [hanviet]: meaning"
      let pinyin = dictMatch?.pinyin || '';
      let hanviet = dictMatch?.hanviet || '';
      let meaning = detail;

      const bracketMatch = detail.match(/\[(.*?)\]/);
      if (bracketMatch) {
        hanviet = bracketMatch[1].trim().toUpperCase();
      }
      if (detail.includes(':')) {
        const splitColon = detail.split(':');
        if (!pinyin) pinyin = splitColon[0].replace(/\[.*?\]/g, '').trim();
        meaning = splitColon.slice(1).join(':').trim();
      }

      words.push({
        id: `import_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        hanzi,
        pinyin: pinyin || dictMatch?.pinyin || '',
        hanviet: hanviet || dictMatch?.hanviet || '',
        meaning: meaning || dictMatch?.meaning || 'Chưa có nghĩa',
        pos: dictMatch?.pos || 'Từ vựng',
        level: (parts[2] as any) || dictMatch?.level || 'HSK1',
        examples: dictMatch?.examples || [],
        box: 1,
        lastReviewed: Date.now(),
      });
      existingHanziSet.add(hanzi);
    }
    return { words, skippedCount: skipped, format: 'tsv' };
  }

  // 3. Kiểm tra CSV (dấu phẩy ,)
  const commaLineCount = lines.filter((l) => l.includes(',')).length;
  if (commaLineCount >= Math.min(2, lines.length)) {
    const words: ChineseWord[] = [];
    let skipped = 0;
    // Bỏ qua dòng tiêu đề nếu chứa "Hán tự" hoặc "hanzi"
    const startIdx = lines[0].toLowerCase().includes('hán tự') || lines[0].toLowerCase().includes('hanzi') ? 1 : 0;

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      // Tách CSV cơ bản có xử lý dấu ngoặc kép
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
      const cleanParts = matches.map((p) => p.replace(/^"|"$/g, '').trim());
      const hanzi = cleanParts[0];

      if (!hanzi || !/[\u3400-\u9fff]/.test(hanzi)) {
        skipped++;
        continue;
      }
      if (existingHanziSet.has(hanzi)) {
        skipped++;
        continue;
      }

      const dictMatch = dictMap.get(hanzi);
      words.push({
        id: `import_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        hanzi,
        pinyin: cleanParts[1] || dictMatch?.pinyin || '',
        hanviet: (cleanParts[2] || dictMatch?.hanviet || '').toUpperCase(),
        meaning: cleanParts[3] || dictMatch?.meaning || 'Chưa có nghĩa',
        pos: cleanParts[4] || dictMatch?.pos || 'Từ vựng',
        level: (cleanParts[5] as any) || dictMatch?.level || 'HSK1',
        examples: dictMatch?.examples || [],
        box: 1,
        lastReviewed: Date.now(),
      });
      existingHanziSet.add(hanzi);
    }
    return { words, skippedCount: skipped, format: 'csv' };
  }

  // 4. Phân tích danh sách theo dòng tự do (VD: 你好: xin chào hoặc 你 (nǐ) - bạn)
  const words: ChineseWord[] = [];
  let skipped = 0;
  for (const line of lines) {
    // Tìm các ký tự chữ Hán đầu tiên trong dòng
    const hanziMatch = line.match(/[\u3400-\u9fff]+/);
    if (!hanziMatch) {
      skipped++;
      continue;
    }
    const hanzi = hanziMatch[0].trim();
    if (existingHanziSet.has(hanzi)) {
      skipped++;
      continue;
    }

    const dictMatch = dictMap.get(hanzi);
    // Tách phần phiên âm trong ngoặc tròn (nếu có: (wǒ) hoặc (nǐ))
    const pinyinInParen = line.match(/\((.*?)\)/);
    const pinyin = pinyinInParen ? pinyinInParen[1].trim() : dictMatch?.pinyin || '';

    // Lấy phần nghĩa sau dấu : hoặc -
    let meaning = '';
    if (line.includes(':')) {
      meaning = line.split(':')[1].trim();
    } else if (line.includes('-')) {
      meaning = line.split('-')[1].trim();
    } else {
      meaning = line.replace(hanzi, '').replace(/\(.*?\)/, '').trim() || dictMatch?.meaning || 'Từ mới';
    }

    words.push({
      id: `import_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      hanzi,
      pinyin,
      hanviet: dictMatch?.hanviet || '',
      meaning: meaning || dictMatch?.meaning || 'Chưa có nghĩa',
      pos: dictMatch?.pos || 'Từ vựng',
      level: dictMatch?.level || 'HSK1',
      examples: dictMatch?.examples || [],
      box: 1,
      lastReviewed: Date.now(),
    });
    existingHanziSet.add(hanzi);
  }

  return { words, skippedCount: skipped, format: 'lines' };
}
