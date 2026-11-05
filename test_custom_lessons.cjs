const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function testCustomLessons(targetUrl) {
  console.log(`=== TESTING CUSTOM LESSONS FEATURE ON ${targetUrl} ===\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--use-fake-ui-for-media-stream', '--window-size=390,844']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[PAGE ERROR]: ${msg.text()}`);
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => consoleErrors.push(err.toString()));

  try {
    // 1. Navigate to App Home
    console.log('1. Loading app...');
    await page.goto(`${targetUrl}/#flashcard`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Verify "Custom" button in header
    const hasCustomBtn = await page.evaluate(() => {
      const btn = document.querySelector('button[data-testid="header-custom-lesson-btn"]');
      return Boolean(btn);
    });
    console.log(`   Header Custom Button present: ${hasCustomBtn ? 'PASS' : 'FAIL'}`);

    // Screenshot 1: Header with Custom button
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'custom_01_header_button.png') });

    // 2. Open Custom Lesson Modal
    console.log('\n2. Opening Custom Lesson Modal...');
    await page.click('button[data-testid="header-custom-lesson-btn"]');
    await new Promise(r => setTimeout(r, 600));

    const modalTitle = await page.evaluate(() => {
      return document.querySelector('h2')?.textContent?.trim();
    });
    console.log(`   Modal opened with title: "${modalTitle}"`);

    // Screenshot 2: Modal Open (Flashcard tab)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'custom_02_modal_flashcard.png') });

    // 3. Add custom word to Flashcard
    console.log('\n3. Testing Add Word to Flashcard...');
    // Click toggle to open Add Word form
    await page.evaluate(() => {
      const toggleBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Thêm từ mới vào Flashcard'));
      if (toggleBtn) toggleBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Fill form
    await page.type('input[placeholder*="朋友"]', '咖啡');
    await page.type('input[placeholder*="péngyou"]', 'kāfēi');
    await page.type('input[placeholder*="BẰNG HỮU"]', 'CA PHÊ');
    await page.type('input[placeholder*="Bạn bè"]', 'Cà phê thơm ngon');

    // Click submit "Lưu từ vựng"
    await page.evaluate(() => {
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Lưu từ vựng'));
      if (saveBtn) saveBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const wordAddedCheck = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('span')).map(s => s.textContent?.trim());
      return cards.includes('咖啡');
    });
    console.log(`   New word "咖啡" added to Flashcard: ${wordAddedCheck ? 'PASS' : 'FAIL'}`);

    // Screenshot 3: Word added
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'custom_03_word_added.png') });

    // 4. Test Tab 3: Ghép Câu (Assembly)
    console.log('\n4. Testing Tab Ghép Câu (Add sentence to Assembly)...');
    await page.evaluate(() => {
      const assemblyTabBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Ghép câu'));
      if (assemblyTabBtn) assemblyTabBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Open Add Sentence Form
    await page.evaluate(() => {
      const toggleBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Thêm câu mới'));
      if (toggleBtn) toggleBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Fill sentence form
    await page.type('input[placeholder*="我们去看电影吧"]', '我想喝一杯咖啡。');
    await page.type('input[placeholder*="Wǒmen qù"]', 'Wǒ xiǎng hē yī bēi kāfēi.');
    await page.type('input[placeholder*="Chúng ta cùng đi xem phim"]', 'Tôi muốn uống một ly cà phê.');
    await page.type('input[placeholder*="我们 去 看 电影 吧"]', '我想 喝 一杯 咖啡');

    // Click submit "Lưu câu bài học"
    await page.evaluate(() => {
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Lưu câu bài học'));
      if (saveBtn) saveBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const sentenceAddedCheck = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('div')).map(d => d.textContent?.trim());
      return texts.some(t => t && t.includes('我想喝一杯咖啡。'));
    });
    console.log(`   New sentence "我想喝一杯咖啡。" added to Assembly: ${sentenceAddedCheck ? 'PASS' : 'FAIL'}`);

    // Screenshot 4: Sentence added to modal
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'custom_04_sentence_added_modal.png') });

    // 5. Test Tab 4: Luyện Nói (Speaking)
    console.log('\n5. Testing Tab Luyện Nói (Add sentence to Speaking)...');
    await page.evaluate(() => {
      const speakingTabBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Luyện nói'));
      if (speakingTabBtn) speakingTabBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Open Add Sentence Form
    await page.evaluate(() => {
      const toggleBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Thêm câu mới'));
      if (toggleBtn) toggleBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    await page.type('input[placeholder*="我们去看电影吧"]', '今天天气非常好！');
    await page.type('input[placeholder*="Wǒmen qù"]', 'Jīntiān tiānqì fēicháng hǎo!');
    await page.type('input[placeholder*="Chúng ta cùng đi xem phim"]', 'Thời tiết hôm nay rất tuyệt vời!');

    await page.evaluate(() => {
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Lưu câu bài học'));
      if (saveBtn) saveBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const speakingAddedCheck = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('div')).map(d => d.textContent?.trim());
      return texts.some(t => t && t.includes('今天天气非常好！'));
    });
    console.log(`   New sentence "今天天气非常好！" added to Speaking: ${speakingAddedCheck ? 'PASS' : 'FAIL'}`);

    // 6. Close Modal with "Hoàn tất & Áp dụng"
    console.log('\n6. Closing modal and applying changes...');
    await page.evaluate(() => {
      const applyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Hoàn tất & Áp dụng'));
      if (applyBtn) applyBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // 7. Verify in Assembly View
    console.log('\n7. Verifying custom sentence in Assembly View...');
    await page.goto(`${targetUrl}/#assembly`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    const assemblyPrompt = await page.evaluate(() => {
      const source = document.querySelector('.text-base.sm\\:text-lg.font-bold')?.textContent?.trim();
      const tokenSpans = Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim());
      return { source, tokenSpans: tokenSpans.filter(Boolean) };
    });
    console.log('   Assembly Exercise:', assemblyPrompt);

    // Screenshot 5: Assembly View with custom sentences
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'custom_05_assembly_active.png') });

    // 8. Verify in Speaking View
    console.log('\n8. Verifying custom sentence in Speaking View...');
    await page.goto(`${targetUrl}/#speaking`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    // Switch to "Luyện nói cả câu"
    await page.evaluate(() => {
      const sentBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Luyện nói cả câu'));
      if (sentBtn) sentBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const speakingInfo = await page.evaluate(() => {
      const counter = Array.from(document.querySelectorAll('span')).find(s => s.textContent && s.textContent.includes('Câu '));
      return counter?.textContent?.trim();
    });
    console.log('   Speaking Sentence Counter:', speakingInfo);

    // Screenshot 6: Speaking View active
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'custom_06_speaking_active.png') });

    console.log('\n=== TEST RESULT SUMMARY ===');
    console.log(`Console Errors: ${consoleErrors.length}`);

    const isAllPass =
      hasCustomBtn &&
      modalTitle === 'Tùy Chỉnh Bài Học' &&
      wordAddedCheck &&
      sentenceAddedCheck &&
      speakingAddedCheck &&
      consoleErrors.length === 0;

    console.log(`Overall Status: ${isAllPass ? 'ALL TESTS PASSED' : 'TESTS FAILED'}`);
    return { success: isAllPass };
  } finally {
    await browser.close();
  }
}

const url = process.argv[2] || 'http://localhost:4173';
testCustomLessons(url)
  .then(res => process.exit(res.success ? 0 : 1))
  .catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
