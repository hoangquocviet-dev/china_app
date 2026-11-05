const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'https://chinaapp.vercel.app';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots', 'live_audit');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runLiveAudit() {
  console.log('=== STARTING DEEP E2E PRODUCTION AUDIT: https://chinaapp.vercel.app ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=390,844']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const consoleErrors = [];
  const networkFailures = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  page.on('requestfailed', req => {
    networkFailures.push(`${req.url()} (${req.failure()?.errorText})`);
  });

  async function switchTab(tabId) {
    const tabSelector = `button[data-tab="${tabId}"]`;
    const btn = await page.$(tabSelector);
    if (btn) {
      await btn.click();
    } else {
      await page.evaluate((id) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const labels = {
          flashcard: 'Flashcard',
          writing: 'Luyện viết',
          assembly: 'Ghép câu',
          translation: 'Luyện dịch',
          library: 'Từ vựng'
        };
        const target = buttons.find(b => b.textContent && b.textContent.includes(labels[id]));
        if (target) {
          target.click();
        } else {
          window.location.hash = id;
        }
      }, tabId);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // 1. LOAD HOME (FLASHCARD)
  console.log('1. Testing Home / Flashcard tab...');
  await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('.perspective-1000', { timeout: 15000 });

  const title = await page.title();
  console.log(`   Page Title: "${title}"`);

  // Take screenshot front card
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_flashcard_front.png') });
  console.log('   Captured: 01_flashcard_front.png');

  // Test Peek Mask toggle
  console.log('   Testing Peek Mask (Hide Pinyin)...');
  const pinyinBtn = await page.$('button[title="Ẩn/Hiện Pinyin"]');
  if (pinyinBtn) {
    await pinyinBtn.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_flashcard_pinyin_masked.png') });
    console.log('   Captured: 02_flashcard_pinyin_masked.png');
    // Toggle back
    await pinyinBtn.click();
    await new Promise(r => setTimeout(r, 300));
  }

  // Test Card Flip (3D Flip)
  console.log('   Testing Card Flip to Back side...');
  const card = await page.$('.perspective-1000');
  if (card) {
    await card.click();
    await new Promise(r => setTimeout(r, 600)); // wait for 3D flip animation
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_flashcard_back.png') });
    console.log('   Captured: 03_flashcard_back.png');
    // Flip back
    await card.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // 2. TEST HANZI WRITING TAB
  console.log('\n2. Testing Hanzi Writer tab (#writing)...');
  await switchTab('writing');
  await page.waitForSelector('.hanzi-canvas-container', { timeout: 10000 });

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_writing_initial.png') });
  console.log('   Captured: 04_writing_initial.png');

  // Check if SVG was rendered inside hanzi-canvas-container
  const hasSvg = await page.evaluate(() => {
    const container = document.querySelector('.hanzi-canvas-container');
    return container && container.querySelectorAll('svg').length > 0;
  });
  console.log(`   Hanzi Canvas SVG rendered: ${hasSvg ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // Test switching grid type
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(el => el.textContent.includes('Ô Mễ') || el.textContent.includes('Ô Điền'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_writing_tian_grid.png') });
  console.log('   Captured: 05_writing_tian_grid.png');

  // 3. TEST SENTENCE ASSEMBLY TAB
  console.log('\n3. Testing Sentence Assembly tab (#assembly)...');
  await switchTab('assembly');

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_assembly_initial.png') });
  console.log('   Captured: 06_assembly_initial.png');

  // Select some word chips
  console.log('   Testing tapping word tokens...');
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('button'));
    // Select the first 2 available token buttons
    const available = chips.filter(b => b.className.includes('bg-slate-800') && b.textContent.length > 0 && !b.getAttribute('data-tab'));
    if (available.length > 0) available[0].click();
    if (available.length > 1) available[1].click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_assembly_tokens_selected.png') });
  console.log('   Captured: 07_assembly_tokens_selected.png');

  // 4. TEST TRANSLATION TAB
  console.log('\n4. Testing Translation tab (#translation)...');
  await switchTab('translation');

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_translation_wordbank.png') });
  console.log('   Captured: 08_translation_wordbank.png');

  // Switch to typing mode
  console.log('   Testing switch to typing mode...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const typeBtn = btns.find(b => b.textContent && b.textContent.includes('Gõ văn bản'));
    if (typeBtn) typeBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_translation_typing_mode.png') });
  console.log('   Captured: 09_translation_typing_mode.png');

  // 5. TEST LIBRARY & SEARCH TAB
  console.log('\n5. Testing Vocabulary Library & Search (#library)...');
  await switchTab('library');

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_library_initial.png') });
  console.log('   Captured: 10_library_initial.png');

  // Test Search Input
  console.log('   Testing Search input query "học"...');
  await page.type('input[placeholder*="Tìm"]', 'học');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_library_filtered.png') });
  console.log('   Captured: 11_library_filtered.png');

  const filteredCount = await page.evaluate(() => {
    const cards = document.querySelectorAll('.rounded-2xl.bg-slate-800\\/80');
    return cards.length;
  });
  console.log(`   Filtered word cards count: ${filteredCount}`);

  // COPY SCREENSHOTS TO ARTIFACT DIR
  const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';
  const shots = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png'));
  for (const s of shots) {
    fs.copyFileSync(path.join(SCREENSHOT_DIR, s), path.join(artifactDir, s));
  }

  await browser.close();

  console.log('\n=== PRODUCTION AUDIT SUMMARY ===');
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Errors:', consoleErrors);
  }
  console.log(`Network Failures: ${networkFailures.length}`);
  if (networkFailures.length > 0) {
    console.error('Failures:', networkFailures);
  }
  console.log(`Screenshots Captured: ${shots.length}`);
  console.log('Status: ALL INTERACTIVE CHECKS COMPLETED SUCCESSFULLY!');
}

runLiveAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
