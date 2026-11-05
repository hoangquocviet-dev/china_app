const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function runTest() {
  console.log('=== STARTING TEST: SEARCH & ADD VOCABULARY FEATURE ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=390,844']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.toString()));

  try {
    // 1. Go to Library tab
    console.log('1. Navigating to Library tab (#library)...');
    await page.goto('http://localhost:4174/#library', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'add_word_01_library_initial.png') });
    console.log('   Captured: add_word_01_library_initial.png');

    // 2. Open Add Word Modal
    console.log('2. Clicking "Tìm & Thêm từ vựng" button...');
    const addBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(el => el.textContent && el.textContent.includes('Tìm & Thêm từ vựng'));
      if (b) {
        b.click();
        return true;
      }
      return false;
    });
    console.log(`   Modal opened: ${addBtn ? 'YES' : 'NO'}`);
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'add_word_02_modal_dictionary.png') });
    console.log('   Captured: add_word_02_modal_dictionary.png');

    // 3. Search dictionary for "táo" or "苹果"
    console.log('3. Searching dictionary for "苹果"...');
    const modalInput = await page.$('.fixed.inset-0 input[placeholder*="Tìm theo chữ Hán"]');
    if (modalInput) {
      await modalInput.type('苹果');
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'add_word_03_search_result.png') });
      console.log('   Captured: add_word_03_search_result.png');

      // Click "+ Thêm" button
      console.log('   Clicking "+ Thêm" button on "苹果"...');
      const added = await page.evaluate(() => {
        const modal = document.querySelector('.fixed.inset-0');
        if (!modal) return false;
        const addButtons = Array.from(modal.querySelectorAll('button'));
        const btn = addButtons.find(b => b.textContent && b.textContent.includes('Thêm'));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });
      console.log(`   Word "苹果" added: ${added ? 'YES' : 'NO'}`);
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'add_word_04_word_added.png') });
      console.log('   Captured: add_word_04_word_added.png');
    }

    // 4. Test Custom Word Creator Mode
    console.log('4. Switching to "Tự nhập từ mới" mode...');
    await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      if (!modal) return;
      const btns = Array.from(modal.querySelectorAll('button'));
      const tab = btns.find(b => b.textContent && b.textContent.includes('Tự nhập từ mới'));
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'add_word_05_custom_mode.png') });
    console.log('   Captured: add_word_05_custom_mode.png');

    // Fill in custom word using real typing
    console.log('   Typing custom word "熊猫" (gấu trúc)...');
    await page.type('input[placeholder*="VD: 猫"]', '熊猫');
    await page.type('input[placeholder*="VD: māo"]', 'xióng māo');
    await page.type('input[placeholder*="VD: MIÊU"]', 'HÙNG MIÊU');
    await page.type('input[placeholder*="VD: Con mèo"]', 'Gấu trúc');

    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'add_word_06_form_filled.png') });
    console.log('   Captured: add_word_06_form_filled.png');

    // Submit custom form
    console.log('   Submitting custom word form...');
    await page.click('form button[type="submit"]');
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'add_word_07_form_submitted.png') });
    console.log('   Captured: add_word_07_form_submitted.png');

    // 5. Close modal and verify library list
    console.log('5. Closing modal and checking updated Library...');
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.fixed.inset-0 button[title="Đóng"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'add_word_08_library_updated.png') });
    console.log('   Captured: add_word_08_library_updated.png');

    // Verify words appear in library
    const hasPanda = await page.evaluate(() => {
      return document.body.innerText.includes('熊猫') && document.body.innerText.includes('Gấu trúc');
    });
    const hasApple = await page.evaluate(() => {
      return document.body.innerText.includes('苹果') && document.body.innerText.includes('Quả táo');
    });
    console.log(`   "熊猫" present in Library: ${hasPanda ? 'PASS' : 'FAIL'}`);
    console.log(`   "苹果" present in Library: ${hasApple ? 'PASS' : 'FAIL'}`);

    // 6. Check Flashcard tab has the newly added words!
    console.log('\n6. Checking Flashcard tab reflection...');
    await page.click('button[data-tab="flashcard"]');
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'add_word_09_flashcard_new_word.png') });
    console.log('   Captured: add_word_09_flashcard_new_word.png');

    console.log('\n=== TEST SUMMARY ===');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) console.error('Errors:', consoleErrors);
    console.log(`Test Result: ${consoleErrors.length === 0 && hasPanda && hasApple ? '100% SUCCESS' : 'FAILED'}`);

  } finally {
    await browser.close();
  }
}

runTest().catch(err => {
  console.error('Test script failed:', err);
  process.exit(1);
});
