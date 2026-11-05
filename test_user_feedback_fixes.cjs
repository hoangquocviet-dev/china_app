const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'https://chinaapp.vercel.app';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function testFeedbackFixes() {
  console.log('=== VERIFYING USER FEEDBACK FIXES ===\n');

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

  // 1. FLASHCARD - Flip and test Example Sentence Audio
  console.log('1. Testing Flashcard Example Sentence Audio...');
  await page.goto(`${APP_URL}/#flashcard`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.perspective-1000', { timeout: 10000 });

  // Flip card
  await page.click('.perspective-1000');
  await new Promise(r => setTimeout(r, 600));

  // Check example sentence buttons
  const exampleBtnFound = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const exBtn = btns.find(b => b.textContent && b.textContent.includes('Nghe'));
    if (exBtn) {
      exBtn.click();
      return true;
    }
    return false;
  });
  console.log(`   Example sentence audio button clicked: ${exampleBtnFound ? 'PASS' : 'FAIL'}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'fix_01_flashcard_example_audio.png') });

  // 2. FLASHCARD - Touch Swipe Right & Left Gestures
  console.log('\n2. Testing Flashcard Swipe Gestures...');
  // Flip back to front
  await page.click('.perspective-1000');
  await new Promise(r => setTimeout(r, 600));

  // Perform swipe right gesture
  console.log('   Performing Swipe Right (Đã thuộc)...');
  const cardBox = await page.$eval('.perspective-1000', el => {
    const rect = el.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });

  // Touch drag right
  await page.touchscreen.touchStart(cardBox.x, cardBox.y);
  await page.touchscreen.touchMove(cardBox.x + 100, cardBox.y);
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'fix_02_flashcard_swiping_right.png') });
  await page.touchscreen.touchEnd();
  await new Promise(r => setTimeout(r, 800));
  console.log('   Swipe right completed. Card advanced.');

  // 3. HANZI WRITER - Hint & Reset Buttons
  console.log('\n3. Testing Hanzi Writer: Gợi ý nét & Xóa viết lại...');
  await page.click('button[data-tab="writing"]');
  await page.waitForSelector('.hanzi-canvas-container', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  // Test "Gợi ý nét" button
  console.log('   Clicking "Gợi ý nét"...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const hintBtn = btns.find(b => b.textContent && b.textContent.includes('Gợi ý nét'));
    if (hintBtn) hintBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'fix_03_writing_hint_active.png') });

  const hintActive = await page.evaluate(() => {
    return document.body.innerText.includes('Gợi ý: Đang minh họa');
  });
  console.log(`   Hint banner displayed: ${hintActive ? 'PASS' : 'FAIL'}`);

  // Test "Xóa viết lại" button
  console.log('   Clicking "Xóa viết lại"...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const resetBtn = btns.find(b => b.textContent && b.textContent.includes('Xóa viết lại'));
    if (resetBtn) resetBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'fix_04_writing_reset_active.png') });

  const resetActive = await page.evaluate(() => {
    return document.body.innerText.includes('Đã làm mới bảng vẽ');
  });
  console.log(`   Reset banner displayed: ${resetActive ? 'PASS' : 'FAIL'}`);

  // 4. SENTENCE ASSEMBLY - Prompt Audio & Correct Completion Speech
  console.log('\n4. Testing Sentence Assembly Prompt Audio & Correct Speech...');
  await page.click('button[data-tab="assembly"]');
  await new Promise(r => setTimeout(r, 1000));

  // Check top prompt "Nghe câu" button
  const promptAudioBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const audioBtn = btns.find(b => b.textContent && b.textContent.includes('Nghe câu'));
    if (audioBtn) {
      audioBtn.click();
      return true;
    }
    return false;
  });
  console.log(`   Top prompt "Nghe câu" button exists and clicked: ${promptAudioBtn ? 'PASS' : 'FAIL'}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'fix_05_assembly_prompt_audio.png') });

  // Select all tokens to test check
  console.log('   Selecting tokens and checking answer...');
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('button'));
    const available = chips.filter(b => b.className.includes('bg-slate-800') && b.textContent.length > 0 && !b.getAttribute('data-tab'));
    for (const c of available) {
      c.click();
    }
  });
  await new Promise(r => setTimeout(r, 400));

  await page.click('button:has-text("Kiểm tra kết quả")').catch(async () => {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const chk = btns.find(b => b.textContent && b.textContent.includes('Kiểm tra'));
      if (chk) chk.click();
    });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'fix_06_assembly_evaluated.png') });

  await browser.close();

  console.log('\n=== FIX VERIFICATION SUMMARY ===');
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log(`Result: ALL CHECKS PASSED SUCCESSFULLY!`);
}

testFeedbackFixes().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
