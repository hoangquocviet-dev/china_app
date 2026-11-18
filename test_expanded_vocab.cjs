const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function testExpandedVocab(targetUrl) {
  console.log(`=== TESTING EXPANDED VOCABULARY & SENTENCES ON ${targetUrl} ===\n`);

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

    // Clear old localStorage to ensure clean default merge verification
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Check Flashcard initial words count
    console.log('2. Checking Flashcard home screen...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_expand_01_flashcard_home.png') });

    // 2. Click "Từ vựng" tab
    console.log('3. Clicking "Từ vựng" tab in bottom nav...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('nav button, button'));
      const vocabTab = tabs.find(b => b.textContent && b.textContent.includes('Từ vựng'));
      if (vocabTab) vocabTab.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    // Verify word count in word list
    const wordListStats = await page.evaluate(() => {
      const stats = document.querySelector('.space-x-1\\.5.font-medium, div:has(> svg.lucide-sparkles)');
      const badges = document.querySelectorAll('.select-all.whitespace-nowrap');
      return {
        statsText: stats ? stats.textContent.trim() : '',
        badgeCount: badges.length
      };
    });
    console.log('Sổ từ vựng count:', wordListStats);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_expand_02_word_list_60.png') });

    // 3. Open Dictionary modal
    console.log('4. Opening Dictionary modal...');
    await page.evaluate(() => {
      const dictBtn = Array.from(document.querySelectorAll('button')).find(
        b => b.textContent && b.textContent.includes('Từ điển')
      );
      if (dictBtn) dictBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Verify dictionary count
    const dictStats = await page.evaluate(() => {
      const title = document.querySelector('h2');
      const items = document.querySelectorAll('button:has(svg.lucide-plus), div:has(> .pinyin-text)');
      return {
        title: title ? title.textContent : '',
        itemCount: items.length
      };
    });
    console.log('Kho từ điển stats:', dictStats);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_expand_03_dictionary_224.png') });

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Đóng"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // 4. Click "Ghép câu" tab
    console.log('5. Clicking "Ghép câu" tab...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('nav button, button'));
      const assemblyTab = tabs.find(b => b.textContent && b.textContent.includes('Ghép câu'));
      if (assemblyTab) assemblyTab.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_expand_04_assembly_sentences.png') });

    // 5. Click "Luyện nói" tab
    console.log('6. Clicking "Luyện nói" tab...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('nav button, button'));
      const speakingTab = tabs.find(b => b.textContent && b.textContent.includes('Luyện nói'));
      if (speakingTab) speakingTab.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_expand_05_speaking_sentences.png') });

    console.log('\n--- CONSOLE ERRORS ---');
    console.log(consoleErrors.length === 0 ? 'None (Clean!)' : consoleErrors);

    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
}

testExpandedVocab(process.argv[2] || 'http://localhost:4173');
