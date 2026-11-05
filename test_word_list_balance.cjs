const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function testWordListBalance(targetUrl) {
  console.log(`=== TESTING WORD LIST BALANCED HANZI BADGE ON ${targetUrl} ===\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=390,844']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.toString()));

  try {
    console.log(`1. Navigating to ${targetUrl} ...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    // Seed "对不起" and "没关系" into localStorage if not present
    await page.evaluate(() => {
      const stored = localStorage.getItem('hanziflow_words');
      let words = stored ? JSON.parse(stored) : [];
      const hasDuiBuQi = words.some(w => w.hanzi === '对不起');
      if (!hasDuiBuQi) {
        words.unshift(
          {
            id: 'word-duibuqi',
            hanzi: '对不起',
            pinyin: 'duì bu qǐ',
            hanviet: 'ĐỐI BẤT KHỞI',
            meaning: 'Xin lỗi',
            pos: 'Động từ',
            level: 'HSK1',
            box: 1
          },
          {
            id: 'word-meiguanxi',
            hanzi: '没关系',
            pinyin: 'méi guān xi',
            hanviet: 'MỘI QUAN HỆ',
            meaning: 'Không có gì, không sao đâu',
            pos: 'Động từ',
            level: 'HSK1',
            box: 2
          }
        );
        localStorage.setItem('hanziflow_words', JSON.stringify(words));
      }
    });

    // Reload page to pick up storage
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Click "Từ vựng" tab
    console.log('2. Clicking "Từ vựng" tab in bottom nav...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('nav button, button'));
      const vocabTab = tabs.find(b => b.textContent && b.textContent.includes('Từ vựng'));
      if (vocabTab) vocabTab.click();
    });

    await new Promise(r => setTimeout(r, 800));

    // Check words in list
    const wordBadges = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('.select-all.whitespace-nowrap'));
      return badges.map(b => ({
        text: b.textContent ? b.textContent.trim() : '',
        width: b.clientWidth,
        height: b.clientHeight,
        scrollWidth: b.scrollWidth,
        scrollHeight: b.scrollHeight,
        isOverflown: b.scrollWidth > b.clientWidth || b.scrollHeight > b.clientHeight
      }));
    });

    console.log('Word badges analysis (first 6 items):', wordBadges.slice(0, 6));

    // Take screenshot showing 对不起 and 没关系
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_01_balanced_word_list.png') });

    console.log('\n--- CONSOLE ERRORS ---');
    console.log(consoleErrors.length === 0 ? 'None (Clean!)' : consoleErrors);

    console.log('\n=== TEST COMPLETED ===');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
}

testWordListBalance(process.argv[2] || 'http://localhost:4173');
