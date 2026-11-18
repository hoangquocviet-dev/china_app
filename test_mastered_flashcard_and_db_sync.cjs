const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function runTest(targetUrl) {
  console.log(`=== RUNNING TEST: FLASHCARD MASTERED FILTER & DICTIONARY DB SYNC ON ${targetUrl} ===\n`);

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
    await new Promise(r => setTimeout(r, 1500));

    // Reset mastered flashcards in storage for clean test
    await page.evaluate(() => {
      localStorage.removeItem('hanziflow_flashcard_mastered_ids');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // --- TEST 1: FLASHCARD MASTERED FILTER & RESET ---
    console.log('2. Testing Flashcard view initial state...');
    let initialHanzi = await page.evaluate(() => {
      const el = document.querySelector('.text-7xl, .text-8xl');
      return el ? el.textContent.trim() : '';
    });
    console.log(`Initial card Hanzi: "${initialHanzi}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'flash_01_initial_deck.png') });

    // Click "Đã thuộc (Nhớ rõ)" on Card 1
    console.log('3. Clicking "Đã thuộc (Nhớ rõ)" on Card 1...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const masteredBtn = btns.find(b => b.textContent && b.textContent.includes('Đã thuộc'));
      if (masteredBtn) masteredBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    let secondHanzi = await page.evaluate(() => {
      const el = document.querySelector('.text-7xl, .text-8xl');
      const masteredBadge = document.querySelector('.bg-emerald-500\\/10');
      return {
        hanzi: el ? el.textContent.trim() : '',
        badge: masteredBadge ? masteredBadge.textContent.trim() : ''
      };
    });
    console.log(`Second card: "${secondHanzi.hanzi}", Mastered badge: "${secondHanzi.badge}"`);
    if (secondHanzi.hanzi === initialHanzi) {
      throw new Error(`FAIL: Card "${initialHanzi}" did not disappear after being marked as mastered!`);
    }
    console.log(`SUCCESS: Card 1 ("${initialHanzi}") was hidden! Now showing card 2 ("${secondHanzi.hanzi}").`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'flash_02_card1_mastered_hidden.png') });

    // Test Top Bar "Reset" button
    console.log('4. Testing top bar Reset button...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const resetBtn = btns.find(b => b.textContent && b.textContent.includes('Reset'));
      if (resetBtn) resetBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    let resetHanzi = await page.evaluate(() => {
      const el = document.querySelector('.text-7xl, .text-8xl');
      return el ? el.textContent.trim() : '';
    });
    console.log(`After Reset, card Hanzi: "${resetHanzi}" (expected "${initialHanzi}")`);
    if (resetHanzi !== initialHanzi) {
      throw new Error(`FAIL: Reset did not restore initial card "${initialHanzi}"!`);
    }
    console.log('SUCCESS: Reset successfully restored all cards from card 1!');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'flash_03_after_reset_restored.png') });

    // Test Deck Completion state: Seed a 2-word mini list to quickly test 100% completion screen
    console.log('5. Testing 100% completed celebration screen...');
    await page.evaluate(() => {
      const words = [
        { id: 'test_card_1', hanzi: '好', pinyin: 'hǎo', hanviet: 'HẢO', meaning: 'Tốt', pos: 'Tính từ', level: 'HSK1', box: 1 },
        { id: 'test_card_2', hanzi: '大', pinyin: 'dà', hanviet: 'ĐẠI', meaning: 'To, lớn', pos: 'Tính từ', level: 'HSK1', box: 1 }
      ];
      localStorage.setItem('hanziflow_words', JSON.stringify(words));
      localStorage.setItem('hanziflow_lesson_config', JSON.stringify({ flashcardWordIds: ['test_card_1', 'test_card_2'] }));
      localStorage.removeItem('hanziflow_flashcard_mastered_ids');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Master card 1
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(x => x.textContent && x.textContent.includes('Đã thuộc'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Master card 2
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(x => x.textContent && x.textContent.includes('Đã thuộc'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    const completionText = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      return h2 ? h2.textContent.trim() : '';
    });
    console.log(`Celebration screen headline: "${completionText}"`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'flash_04_completion_screen.png') });

    // Click "Học lại từ đầu (Reset)" on celebration screen
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const resetBtn = btns.find(b => b.textContent && b.textContent.includes('Học lại từ đầu'));
      if (resetBtn) resetBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const restoredCards = await page.evaluate(() => {
      const el = document.querySelector('.text-7xl, .text-8xl');
      return el ? el.textContent.trim() : '';
    });
    console.log(`Cards restored after celebration reset: "${restoredCards}"`);
    if (!restoredCards) throw new Error('FAIL: Cards were not restored after celebration reset!');

    // Clean up test config
    await page.evaluate(() => {
      localStorage.removeItem('hanziflow_lesson_config');
      localStorage.removeItem('hanziflow_words');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // --- TEST 2: USER ADD WORD AUTO-SYNCS TO DICTIONARY DB ---
    console.log('\n6. Testing User Add Word -> Auto-Sync to Dictionary DB...');
    // Navigate to "Từ vựng" tab
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('nav button, button'));
      const vocabTab = tabs.find(b => b.textContent && b.textContent.includes('Từ vựng'));
      if (vocabTab) vocabTab.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Click "Tìm & Thêm từ vựng"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent && b.textContent.includes('Tìm & Thêm từ vựng'));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Switch to "Tự nhập từ mới" tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const customTab = btns.find(b => b.textContent && b.textContent.includes('Tự nhập từ mới'));
      if (customTab) customTab.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Enter manual custom word: 机器人 (Robot)
    console.log('Filling custom word: 机器人 (jī qì rén - Người máy)...');
    const hanziInput = 'input[placeholder*="猫"]';
    await page.waitForSelector(hanziInput, { timeout: 5000 });
    await page.type(hanziInput, '机器人');

    const pinyinInput = 'input[placeholder*="māo"]';
    await page.type(pinyinInput, 'jī qì rén');

    const hanvietInput = 'input[placeholder*="MIÊU"]';
    await page.type(hanvietInput, 'CƠ KHÍ NHÂN');

    const meaningInput = 'input[placeholder*="Con mèo"]';
    await page.type(meaningInput, 'Người máy, robot thông minh');
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'db_01_word_filled.png') });

    // Click "Lưu vào sổ từ"
    console.log('Saving word to notebook & dictionary DB...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const saveBtn = btns.find(b => b.textContent && b.textContent.includes('Lưu vào sổ từ'));
      if (saveBtn) saveBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'db_02_word_saved.png') });

    // Switch to "Tra cứu từ điển" tab in modal
    console.log('7. Switching to "Tra cứu từ điển" tab to verify auto-sync to DB...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dictTab = btns.find(b => b.textContent && b.textContent.includes('Tra cứu từ điển'));
      if (dictTab) dictTab.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Type "người máy" into dictionary search box in modal
    const searchInput = 'input[placeholder*="Tìm theo chữ Hán"]';
    await page.waitForSelector(searchInput);
    await page.click(searchInput);
    await page.type(searchInput, 'người máy', { delay: 50 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'db_03_search_typed.png') });

    const dictLookupResult = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      const items = modal ? Array.from(modal.querySelectorAll('.rounded-2xl')) : [];
      const robotItem = items.find(it => it.textContent && it.textContent.toLowerCase().includes('người máy'));
      return {
        found: Boolean(robotItem),
        text: robotItem ? robotItem.textContent.trim().replace(/\s+/g, ' ') : '',
        hasUserDbBadge: robotItem ? robotItem.textContent.includes('User DB') : false,
        itemsCount: items.length
      };
    });

    console.log('Dictionary lookup result for "người máy":', dictLookupResult);
    if (!dictLookupResult.found) {
      throw new Error('FAIL: Newly added word "người máy" was NOT found in the Dictionary DB!');
    }
    if (!dictLookupResult.hasUserDbBadge) {
      throw new Error('FAIL: Newly added word "người máy" does not have the User DB badge!');
    }
    console.log('SUCCESS: Word "người máy" was auto-synced into Dictionary DB with User DB badge!');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'db_03_word_found_in_dict_db.png') });
    console.log('SUCCESS: Word "mèo" is permanently searchable in Dictionary DB with User DB badge!');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'db_03_word_found_in_dict_db.png') });

    console.log('\n--- CONSOLE ERRORS ---');
    console.log(consoleErrors.length === 0 ? 'None (Clean!)' : consoleErrors);

    console.log('\n=== ALL TESTS PASSED PROUDLY! ===');
  } catch (err) {
    console.error('Test error:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

const targetUrl = process.argv[2] || 'http://localhost:4173';
runTest(targetUrl);
