const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function runTest(targetUrl) {
  console.log(`=== TESTING DYNAMIC BATCH DECK IMPORT & BALANCED BADGES ON ${targetUrl} ===\n`);

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

    // Step 1: Open Custom Lesson Modal
    console.log('2. Clicking "Tùy chỉnh" button in header...');
    await page.evaluate(() => {
      const customBtn = document.querySelector('button[title="Tùy chỉnh bài học"], button:has(svg.lucide-settings)');
      if (customBtn) customBtn.click();
      else {
        const btns = Array.from(document.querySelectorAll('button'));
        const found = btns.find(b => b.textContent && b.textContent.includes('Tùy chỉnh'));
        if (found) found.click();
      }
    });
    await new Promise(r => setTimeout(r, 800));

    // Step 2: Open Word form
    console.log('3. Opening Add Word form in Custom Lesson Modal...');
    await page.evaluate(() => {
      const toggleBtn = document.querySelector('[data-testid="toggle-add-word-btn"]');
      if (toggleBtn) toggleBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Step 3: Switch to Batch Mode for Words
    console.log('4. Switching to "Nhập cả bộ" mode for Words...');
    await page.evaluate(() => {
      const batchBtn = document.querySelector('[data-testid="mode-batch-word-btn"]');
      if (batchBtn) batchBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Step 4: Fill multi-line words
    console.log('5. Typing multi-line custom deck of words...');
    const sampleWords = 'cà phê\nbác sĩ\nbạn bè';
    await page.evaluate((text) => {
      const textarea = document.querySelector('[data-testid="batch-words-input"]');
      if (textarea) {
        textarea.value = text;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, sampleWords);
    await new Promise(r => setTimeout(r, 400));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'batch_01_words_input.png') });

    // Step 5: Click Generate & Add Batch Words
    console.log('6. Clicking "Tự tạo & Đồng bộ cả bộ vào bài học"...');
    await page.evaluate(() => {
      const generateBtn = document.querySelector('[data-testid="batch-generate-words-btn"]');
      if (generateBtn) generateBtn.click();
    });

    // Wait for batch processing to complete
    await new Promise(r => setTimeout(r, 3500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'batch_02_words_added.png') });

    // Step 6: Switch to Assembly Tab and test Batch Sentences
    console.log('7. Switching to Assembly tab...');
    await page.evaluate(() => {
      const assemblyTab = document.querySelector('[data-testid="modal-tab-assembly"]');
      if (assemblyTab) assemblyTab.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Open Sentence form
    console.log('8. Opening Add Sentence form...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const toggle = btns.find(b => b.textContent && b.textContent.includes('Thêm câu mới'));
      if (toggle) toggle.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Switch to Batch Mode for Sentences
    console.log('9. Switching to "Nhập cả bộ" mode for Sentences...');
    await page.evaluate(() => {
      const batchBtn = document.querySelector('[data-testid="mode-batch-sentence-btn"]');
      if (batchBtn) batchBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Fill multi-line sentences
    console.log('10. Typing multi-line custom deck of sentences...');
    const sampleSentences = 'Hôm nay tôi rất vui\nBạn muốn uống gì?';
    await page.evaluate((text) => {
      const textarea = document.querySelector('[data-testid="batch-sentences-input"]');
      if (textarea) {
        textarea.value = text;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, sampleSentences);
    await new Promise(r => setTimeout(r, 400));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'batch_03_sentences_input.png') });

    // Click Generate & Add Batch Sentences
    console.log('11. Clicking "Tự tạo & Đồng bộ cả bộ câu vào bài học"...');
    await page.evaluate(() => {
      const generateBtn = document.querySelector('[data-testid="batch-generate-sentences-btn"]');
      if (generateBtn) generateBtn.click();
    });

    await new Promise(r => setTimeout(r, 3500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'batch_04_sentences_added.png') });

    // Step 7: Close modal and verify Word Library badges
    console.log('12. Closing modal and checking Word Library...');
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Đóng bảng tùy chỉnh"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Click "Từ vựng" tab in bottom nav
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('nav button, button'));
      const vocabTab = tabs.find(b => b.textContent && b.textContent.includes('Từ vựng'));
      if (vocabTab) vocabTab.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Verify badges and lack of overflow
    const badgesInfo = await page.evaluate(() => {
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

    console.log('Sample badges in Library (first 6 items):', badgesInfo.slice(0, 6));
    const anyOverflown = badgesInfo.some(b => b.isOverflown);
    console.log('Any badge overflown?', anyOverflown);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'batch_05_library_balanced.png') });

    console.log('\n--- CONSOLE ERRORS ---');
    console.log(consoleErrors.length === 0 ? 'None (Clean!)' : consoleErrors);

    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
}

runTest(process.argv[2] || 'http://localhost:4173');
