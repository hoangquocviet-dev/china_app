const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function testSentenceAutoGen(targetUrl) {
  console.log(`=== TESTING SENTENCE AUTO-GENERATION FEATURE ON ${targetUrl} ===\n`);

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

    // Open Custom modal
    console.log('2. Opening Custom Lessons Modal...');
    await page.evaluate(() => {
      const headerBtns = Array.from(document.querySelectorAll('header button'));
      const customBtn = headerBtns.find(b => b.textContent?.includes('Custom'));
      if (customBtn) customBtn.click();
    });
    await new Promise(r => setTimeout(r, 700));

    // Switch to "Ghép câu" tab
    console.log('3. Switching to "Ghép câu" tab...');
    await page.evaluate(() => {
      const tab = document.querySelector('[data-testid="modal-tab-assembly"]');
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Open Add Sentence Form
    console.log('4. Opening Add Sentence Form...');
    await page.evaluate(() => {
      const addBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent?.includes('Thêm câu mới vào Ghép câu')
      );
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Take screenshot showing Vietnamese sentence input & quick suggestion chips
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sentence_autogen_01_form_open.png') });

    // Click quick suggestion: "+ Hôm nay tôi rất vui"
    console.log('5. Clicking suggestion "+ Hôm nay tôi rất vui"...');
    await page.evaluate(() => {
      const chip = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent?.includes('Hôm nay tôi rất vui')
      );
      if (chip) chip.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // Click "Tự tạo & Thêm"
    console.log('6. Clicking "Tự tạo & Thêm"...');
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="auto-generate-sentence-btn"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // Check Toast
    const toastText = await page.evaluate(() => {
      const toast = document.querySelector('.bg-emerald-500\\/10');
      return toast ? toast.textContent?.trim() : null;
    });
    console.log('Success Toast:', toastText);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sentence_autogen_02_sentence_added.png') });

    // Close Custom modal
    console.log('7. Closing Custom Modal and inspecting Assembly tab...');
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.max-w-lg button[title="Đóng bảng tùy chỉnh"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Go to "Ghép câu" main tab
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('nav button')).find(b =>
        b.textContent?.includes('Ghép câu')
      );
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sentence_autogen_03_assembly_active.png') });

    console.log('\n--- CONSOLE ERRORS ---');
    console.log(consoleErrors.length === 0 ? 'None (Clean!)' : consoleErrors);

    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
}

testSentenceAutoGen(process.argv[2] || 'http://localhost:4173');
