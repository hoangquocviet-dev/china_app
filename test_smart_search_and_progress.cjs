const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function runTest(targetUrl) {
  console.log(`=== RUNNING SMART SEARCH & PROGRESS TEST ON ${targetUrl} ===\n`);

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
    console.log(`1. Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    // --- TEST 1: Flashcard Progress Bar calculation ---
    console.log('2. Testing Flashcard Progress Bar Style...');
    const pBarWidth = await page.evaluate(() => {
      const pBar = document.querySelector('.bg-gradient-to-r.from-emerald-500.to-rose-500');
      return pBar ? pBar.style.width : null;
    });
    console.log(`Initial progress bar width: "${pBarWidth}"`);
    if (!pBarWidth || !pBarWidth.startsWith('0%')) {
      throw new Error(`Expected progress bar to start at 0%, got: ${pBarWidth}`);
    }
    console.log('[PASS] Test 1: Flashcard progress bar starts at 0%.\n');

    // --- TEST 2: Smart Search in Vocabulary Tab (Toneless Pinyin & Unaccented Vietnamese) ---
    console.log('3. Testing Smart Search in Vocabulary Tab...');
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-tab="library"]');
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    const searchInput = await page.$('input[placeholder*="Tìm trong sổ từ"]');
    if (!searchInput) throw new Error('Search input not found in Vocabulary tab.');

    // 2.1 Search toneless pinyin: "ni"
    console.log('Searching toneless Pinyin "ni"...');
    await searchInput.type('ni');
    await new Promise(r => setTimeout(r, 600));

    let foundWords = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('.hanzi-badge'));
      return badges.map(b => b.textContent.trim());
    });
    console.log('Results for "ni":', foundWords);
    if (!foundWords.includes('你')) {
      throw new Error(`Expected "你" in results for "ni", got: ${JSON.stringify(foundWords)}`);
    }

    // Clear search
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Tìm trong sổ từ"]');
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 400));

    // 2.2 Search unaccented Vietnamese: "ban be"
    console.log('Searching unaccented Vietnamese "ban be"...');
    await searchInput.type('ban be');
    await new Promise(r => setTimeout(r, 600));

    foundWords = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('.hanzi-badge'));
      return badges.map(b => b.textContent.trim());
    });
    console.log('Results for "ban be":', foundWords);
    if (!foundWords.includes('朋友')) {
      throw new Error(`Expected "朋友" in results for "ban be", got: ${JSON.stringify(foundWords)}`);
    }

    // Clear search
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Tìm trong sổ từ"]');
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 400));

    // 2.3 Search toneless space-less Pinyin: "pengyou"
    console.log('Searching toneless Pinyin "pengyou"...');
    await searchInput.type('pengyou');
    await new Promise(r => setTimeout(r, 600));

    foundWords = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('.hanzi-badge'));
      return badges.map(b => b.textContent.trim());
    });
    console.log('Results for "pengyou":', foundWords);
    if (!foundWords.includes('朋友')) {
      throw new Error(`Expected "朋友" in results for "pengyou", got: ${JSON.stringify(foundWords)}`);
    }
    console.log('[PASS] Test 2: Smart Search in Vocabulary tab verified!\n');

    // --- TEST 3: Smart Search in Dictionary Modal ---
    console.log('4. Testing Smart Search in Dictionary Modal...');
    // Open modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dictBtn = btns.find(b => b.textContent && b.textContent.includes('Từ điển'));
      if (dictBtn) dictBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const dictInput = await page.$('input[placeholder*="Tìm theo chữ Hán"]');
    if (!dictInput) throw new Error('Dictionary search input not found in modal.');

    console.log('Searching dictionary with toneless "laoshi"...');
    await dictInput.type('laoshi');
    await new Promise(r => setTimeout(r, 600));

    const dictResult = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      if (!modal) return [];
      const cards = Array.from(modal.querySelectorAll('.p-3.rounded-2xl'));
      return cards.map(c => c.textContent);
    });
    console.log('Dict results count for "laoshi":', dictResult.length);
    const hasLaoshi = dictResult.some(text => text.includes('老师'));
    if (!hasLaoshi) {
      throw new Error('Dictionary search did not find "老师" for query "laoshi"!');
    }
    console.log('[PASS] Test 3: Dictionary modal smart search verified!\n');

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title*="Đóng"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Check Console Errors
    const filteredErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('manifest'));
    if (filteredErrors.length > 0) {
      console.warn('Console errors detected:', filteredErrors);
    } else {
      console.log('Console Errors: 0');
    }

    console.log('\n=== ALL SMART SEARCH & PROGRESS TESTS PASSED! ===');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

const target = process.argv[2] || 'http://127.0.0.1:4188';
runTest(target);
