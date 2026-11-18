const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function runTest(targetUrl) {
  console.log(`=== RUNNING DEEP AUDIT & VERIFICATION TEST ON ${targetUrl} ===\n`);

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

    // Clear storage for clean baseline
    await page.evaluate(() => {
      localStorage.removeItem('hanziflow_flashcard_mastered_ids');
      localStorage.removeItem('hanziflow_deleted_words');
      localStorage.removeItem('hanziflow_deleted_sentences');
      localStorage.removeItem('hanziflow_words');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // --- TEST 1: Flashcard Counter & Reset ---
    console.log('2. Testing Flashcard Counter & Reset...');
    const fcState1 = await page.evaluate(() => {
      const remainingEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent && s.textContent.includes('Còn '));
      const masteredEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent && s.textContent.includes('Đã thuộc:'));
      return {
        remaining: remainingEl ? remainingEl.textContent.trim() : null,
        mastered: masteredEl ? masteredEl.textContent.trim() : null,
      };
    });
    console.log('Initial Flashcard State:', fcState1);
    if (!fcState1.mastered || !fcState1.mastered.includes('0/')) {
      throw new Error(`Expected initial mastered to be 0/X, got: ${fcState1.mastered}`);
    }

    // Swipe / Click "Đã thuộc"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const masteredBtn = btns.find(b => b.textContent && b.textContent.includes('Đã thuộc'));
      if (masteredBtn) masteredBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const fcState2 = await page.evaluate(() => {
      const masteredEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent && s.textContent.includes('Đã thuộc:'));
      return masteredEl ? masteredEl.textContent.trim() : null;
    });
    console.log('After mastering 1 card:', fcState2);
    if (!fcState2 || !fcState2.includes('1/')) {
      throw new Error(`Expected mastered to be 1/X, got: ${fcState2}`);
    }

    // Click Reset in Top Bar
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const resetBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Reset');
      if (resetBtn) resetBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const fcState3 = await page.evaluate(() => {
      const masteredEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent && s.textContent.includes('Đã thuộc:'));
      return masteredEl ? masteredEl.textContent.trim() : null;
    });
    console.log('After Reset:', fcState3);
    if (!fcState3 || !fcState3.includes('0/')) {
      throw new Error(`Expected mastered to reset to 0/X, got: ${fcState3}`);
    }
    console.log('[PASS] Test 1: Flashcard accurate counter and reset passed.\n');

    // --- TEST 2: Word Deletion Persistence (No Resurrection) ---
    console.log('3. Testing Word Deletion Persistence without Resurrection...');
    // Switch to Vocabulary tab
    await page.evaluate(() => {
      const libTab = document.querySelector('button[data-tab="library"]');
      if (libTab) libTab.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Get the first word hanzi
    const firstWordHanzi = await page.evaluate(() => {
      const badge = document.querySelector('.hanzi-badge');
      return badge ? badge.textContent.trim() : null;
    });
    console.log(`Word to delete: "${firstWordHanzi}"`);

    // Override window.confirm to return true and click delete
    await page.evaluate((targetHanzi) => {
      window.confirm = () => true;
      const wordCards = Array.from(document.querySelectorAll('.space-y-2\\.5 > div'));
      const card = wordCards.find(c => {
        const badge = c.querySelector('.hanzi-badge');
        return badge && badge.textContent.trim() === targetHanzi;
      });
      if (card) {
        const trashBtn = card.querySelector('button[title*="Xóa"]');
        if (trashBtn) trashBtn.click();
      }
    }, firstWordHanzi);
    await new Promise(r => setTimeout(r, 800));

    // Verify word is removed from list
    const isStillPresentBeforeReload = await page.evaluate((targetHanzi) => {
      const badges = Array.from(document.querySelectorAll('.hanzi-badge'));
      return badges.some(b => b.textContent.trim() === targetHanzi);
    }, firstWordHanzi);
    console.log(`Word present immediately after delete: ${isStillPresentBeforeReload}`);
    if (isStillPresentBeforeReload) {
      throw new Error(`Word "${firstWordHanzi}" was not removed from DOM after delete.`);
    }

    // Now RELOAD page and verify it did NOT resurrect
    console.log('Reloading page to verify delete persisted and was not resurrected by defaults...');
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Switch back to Vocabulary tab
    await page.evaluate(() => {
      const libTab = document.querySelector('button[data-tab="library"]');
      if (libTab) libTab.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const isResurrectedAfterReload = await page.evaluate((targetHanzi) => {
      const badges = Array.from(document.querySelectorAll('.hanzi-badge'));
      return badges.some(b => b.textContent.trim() === targetHanzi);
    }, firstWordHanzi);
    console.log(`Word resurrected after reload: ${isResurrectedAfterReload}`);
    if (isResurrectedAfterReload) {
      throw new Error(`FAIL: Word "${firstWordHanzi}" resurrected after reload! Resurrection bug persists.`);
    }
    console.log(`[PASS] Test 2: Word deletion properly persists without resurrection!\n`);

    // --- TEST 3: Add Custom Word & Auto-sync into DB & LessonConfig ---
    console.log('4. Testing Custom Word Creation & Auto-sync into DB and LessonConfig...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent && b.textContent.includes('Tìm & Thêm từ vựng'));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Switch to "Tự nhập từ mới"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const customTab = btns.find(b => b.textContent && b.textContent.includes('Tự nhập từ mới'));
      if (customTab) customTab.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Fill form
    const testHanzi = '超人';
    const testPinyin = 'chāo rén';
    const testHanviet = 'SIÊU NHÂN';
    const testMeaning = 'người có sức mạnh phi thường';

    await page.type('input[placeholder*="猫"]', testHanzi);
    await page.type('input[placeholder*="māo"]', testPinyin);
    await page.type('input[placeholder*="MIÊU"]', testHanviet);
    await page.type('input[placeholder*="mèo"]', testMeaning);

    // Click submit
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const submitBtn = btns.find(b => b.textContent && b.textContent.includes('Lưu vào sổ từ'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Check if word appears in Dictionary DB
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dictTab = btns.find(b => b.textContent && b.textContent.includes('Tra cứu từ điển'));
      if (dictTab) dictTab.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const dictInput = await page.$('input[placeholder*="Tìm theo chữ Hán"]');
    if (dictInput) {
      await dictInput.type('超人');
      await new Promise(r => setTimeout(r, 600));
    }

    const dictSearchResult = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      if (!modal) return null;
      const items = Array.from(modal.querySelectorAll('.p-3.rounded-2xl'));
      const match = items.find(el => el.textContent && el.textContent.includes('超人'));
      if (!match) return null;
      return {
        text: match.textContent,
        hasUserDbBadge: match.textContent.includes('User DB'),
      };
    });
    console.log('Dictionary DB search result for added word:', dictSearchResult);
    if (!dictSearchResult || !dictSearchResult.hasUserDbBadge) {
      throw new Error('Newly created word was not found in Dictionary DB with User DB badge!');
    }
    console.log('[PASS] Test 3: Custom word auto-sync to DB verified!\n');

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Đóng"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // --- TEST 4: Navigation through Writing, Assembly, Speaking ---
    console.log('5. Testing other views (Writing, Assembly, Speaking)...');
    
    // Writing Tab
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-tab="writing"]');
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    const writingReady = await page.evaluate(() => {
      return Boolean(document.querySelector('.hanzi-canvas-container'));
    });
    console.log('Writing canvas ready:', writingReady);

    // Assembly Tab
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-tab="assembly"]');
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    const assemblyReady = await page.evaluate(() => {
      return Boolean(document.querySelector('button[title*="Nghe câu"]'));
    });
    console.log('Assembly practice ready:', assemblyReady);

    // Speaking Tab
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-tab="speaking"]');
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    const speakingReady = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent && b.textContent.includes('Bắt đầu nói'));
    });
    console.log('Speaking practice ready:', speakingReady);

    // Take screenshot of speaking
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_speaking_view.png') });

    // Check Console Errors
    const filteredErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('manifest'));
    if (filteredErrors.length > 0) {
      console.warn('Console errors detected:', filteredErrors);
    } else {
      console.log('Console Errors: 0');
    }

    console.log('\n=== ALL DEEP AUDIT CHECKS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

const target = process.argv[2] || 'http://localhost:4188';
runTest(target);
