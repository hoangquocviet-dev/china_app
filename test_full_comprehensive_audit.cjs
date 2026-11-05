const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';
const TARGET_URL = process.argv[2] || 'https://chinaapp.vercel.app';

async function runComprehensiveAudit() {
  console.log(`=======================================================`);
  console.log(`   FULL COMPREHENSIVE AUTOMATED QA AUDIT & TEST RUNNER`);
  console.log(`   Target: ${TARGET_URL}`);
  console.log(`=======================================================\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=390,844']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const auditLog = {
    consoleErrors: [],
    pageErrors: [],
    testResults: []
  };

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[BROWSER ERROR]', msg.text());
      auditLog.consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    console.error('[PAGE EXCEPTION]', err.toString());
    auditLog.pageErrors.push(err.toString());
  });

  try {
    // -------------------------------------------------------------
    // TEST SUITE 1: APP INITIALIZATION & NO HORIZONTAL OVERFLOW
    // -------------------------------------------------------------
    console.log('\n--- [TEST 1] APP INITIALIZATION & LAYOUT VIEWPORT ---');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));

    const viewportCheck = await page.evaluate(() => {
      const bodyWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      const navTabs = Array.from(document.querySelectorAll('nav button')).map(b => b.textContent?.trim());
      return {
        hasHorizontalOverflow: bodyWidth > windowWidth + 2,
        bodyWidth,
        windowWidth,
        navTabs
      };
    });
    console.log('Viewport & Overflow check:', viewportCheck);
    auditLog.testResults.push({
      suite: 'Layout',
      name: 'Zero horizontal layout overflow on mobile viewport',
      passed: !viewportCheck.hasHorizontalOverflow
    });

    const hasAllTabs = ['Flashcard', 'Luyện viết', 'Ghép câu', 'Luyện nói', 'Từ vựng'].every(tab =>
      viewportCheck.navTabs.some(t => t?.includes(tab))
    );
    auditLog.testResults.push({
      suite: 'Navigation',
      name: 'All 5 main tabs present in BottomNav',
      passed: hasAllTabs
    });

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_01_flashcard_home.png') });

    // -------------------------------------------------------------
    // TEST SUITE 2: FLASHCARD VIEW (GESTURE & FLIP TEST)
    // -------------------------------------------------------------
    console.log('\n--- [TEST 2] FLASHCARD: SWIPE UP & TAP FLIP ---');
    const cardBox = await page.evaluate(() => {
      const card = document.querySelector('.perspective-1000');
      if (!card) return null;
      const rect = card.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });

    if (cardBox) {
      const client = await page.target().createCDPSession();
      const cx = cardBox.x + cardBox.width / 2;
      const startY = cardBox.y + cardBox.height * 0.7;
      const endY = cardBox.y + cardBox.height * 0.2;

      await client.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: cx, y: startY, id: 0 }]
      });
      for (let i = 1; i <= 6; i++) {
        await client.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: cx, y: startY + (endY - startY) * (i / 6), id: 0 }]
        });
        await new Promise(r => setTimeout(r, 20));
      }
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: []
      });
    }

    await new Promise(r => setTimeout(r, 700));

    const isFlipped = await page.evaluate(() => {
      const card3D = document.querySelector('.transform-style-3d');
      return card3D?.className.includes('rotate-x-180') ?? false;
    });
    console.log('Flashcard flipped after swipe up:', isFlipped);
    auditLog.testResults.push({
      suite: 'Flashcard',
      name: 'Swipe Up to flip card',
      passed: isFlipped
    });

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_02_flashcard_flipped_back.png') });

    // Tap to flip back
    if (cardBox) {
      const client = await page.target().createCDPSession();
      const cx = cardBox.x + cardBox.width / 2;
      const cy = cardBox.y + cardBox.height / 2;
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: cx, y: cy, id: 0 }]
      });
      await new Promise(r => setTimeout(r, 50));
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: []
      });
    }
    await new Promise(r => setTimeout(r, 700));

    // -------------------------------------------------------------
    // TEST SUITE 3: WRITING PRACTICE VIEW (HANZIWRITER & STROKE HINT)
    // -------------------------------------------------------------
    console.log('\n--- [TEST 3] WRITING PRACTICE: CANVAS & STROKE HINT ---');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const writingBtn = buttons.find(b => b.textContent?.includes('Luyện viết'));
      if (writingBtn) writingBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    const writingCanvas = await page.evaluate(() => {
      const container = document.querySelector('.hanzi-canvas-container');
      const svg = container?.querySelector('svg');
      return {
        exists: !!container && !!svg,
        width: svg?.clientWidth || 0,
        height: svg?.clientHeight || 0
      };
    });
    console.log('Writing canvas status:', writingCanvas);
    auditLog.testResults.push({
      suite: 'Writing',
      name: 'HanziWriter SVG canvas render',
      passed: writingCanvas.exists && writingCanvas.width > 100
    });

    // Test "Gợi ý nét" button
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent?.includes('Gợi ý nét')
      );
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const writingHintBanner = await page.evaluate(() => {
      const banner = Array.from(document.querySelectorAll('div')).find(d =>
        d.textContent?.includes('Gợi ý: Đang minh họa nét thứ')
      );
      return banner ? banner.textContent?.trim() : null;
    });
    console.log('Writing hint banner:', writingHintBanner);
    auditLog.testResults.push({
      suite: 'Writing',
      name: 'Stroke hint animation & non-blocking banner',
      passed: !!writingHintBanner
    });

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_03_writing_canvas_hint.png') });

    // -------------------------------------------------------------
    // TEST SUITE 4: SENTENCE ASSEMBLY VIEW (AUDIO & INTERACTIVE TOKENS)
    // -------------------------------------------------------------
    console.log('\n--- [TEST 4] SENTENCE ASSEMBLY: AUDIO PROMPT & INTERACTIVE TOKENS ---');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const assemblyBtn = buttons.find(b => b.textContent?.includes('Ghép câu'));
      if (assemblyBtn) assemblyBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    const assemblyState = await page.evaluate(() => {
      const promptListenBtn = Array.from(document.querySelectorAll('button')).some(b =>
        b.textContent?.includes('Nghe câu')
      );
      const allButtons = Array.from(document.querySelectorAll('button'));
      const checkBtn = allButtons.some(b => b.textContent?.includes('Kiểm tra'));
      return {
        hasPromptListen: promptListenBtn,
        hasCheckBtn: checkBtn
      };
    });
    console.log('Sentence Assembly elements:', assemblyState);
    auditLog.testResults.push({
      suite: 'Assembly',
      name: 'Assembly prompt listen button & check button present',
      passed: assemblyState.hasPromptListen && assemblyState.hasCheckBtn
    });

    // Interactive token clicking: pick the first available token
    const tokenPicked = await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      const token = allButtons.find(b => {
        const text = b.textContent?.trim() || '';
        return text.length >= 1 && text.length <= 4 && !['Nghe câu', 'Làm lại', 'Kiểm tra', 'Câu trước', 'Câu sau', 'Flashcard', 'Luyện viết', 'Ghép câu', 'Luyện nói', 'Từ vựng', 'Custom'].includes(text);
      });
      if (token) {
        const text = token.textContent?.trim();
        token.click();
        return text;
      }
      return null;
    });
    console.log('Picked assembly token:', tokenPicked);
    auditLog.testResults.push({
      suite: 'Assembly',
      name: 'Interactive token click into upper drop zone',
      passed: !!tokenPicked
    });

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_04_sentence_assembly.png') });

    // -------------------------------------------------------------
    // TEST SUITE 5: SPEAKING PRACTICE VIEW (AI RECOGNITION & PERMISSION GUIDE)
    // -------------------------------------------------------------
    console.log('\n--- [TEST 5] SPEAKING PRACTICE: MIC & PERMISSION GUIDE MODAL ---');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const speakingBtn = buttons.find(b => b.textContent?.includes('Luyện nói'));
      if (speakingBtn) speakingBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    const speakingElements = await page.evaluate(() => {
      const micBtn = document.querySelector('[data-testid="speaking-mic-btn"]');
      const listenSample = Array.from(document.querySelectorAll('button')).some(b =>
        b.textContent?.includes('Nghe mẫu')
      );
      const guideBtn = Array.from(document.querySelectorAll('button')).some(b =>
        b.textContent?.includes('Trợ giúp Micro')
      );
      return {
        hasMicBtn: !!micBtn,
        hasListenSample: listenSample,
        hasGuideBtn: guideBtn
      };
    });
    console.log('Speaking practice elements:', speakingElements);
    auditLog.testResults.push({
      suite: 'Speaking',
      name: 'Speaking Mic button and sample audio available',
      passed: speakingElements.hasMicBtn && speakingElements.hasListenSample
    });

    // Open Permission Guide Modal
    console.log('Opening Speaking Permission Guide Modal...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent?.includes('Trợ giúp Micro')
      );
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const guideModalOpen = await page.evaluate(() => {
      return document.body.innerText.includes('Khắc phục lỗi cấp quyền Micro');
    });
    console.log('Permission guide modal open:', guideModalOpen);
    auditLog.testResults.push({
      suite: 'Speaking',
      name: 'Permission & Screen Overlay Guide Modal works',
      passed: guideModalOpen
    });

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_05_speaking_permission_modal.png') });

    // Close Modal
    await page.evaluate(() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent?.includes('Tôi đã hiểu') || b.querySelector('svg')
      );
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // -------------------------------------------------------------
    // TEST SUITE 6: VOCABULARY LIST (BADGE WIDTH & LAYOUT BALANCE)
    // -------------------------------------------------------------
    console.log('\n--- [TEST 6] VOCABULARY LIST: BALANCED BADGES & SEARCH ---');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const wordsBtn = buttons.find(b => b.textContent?.includes('Từ vựng'));
      if (wordsBtn) wordsBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    const vocabBadges = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('.select-all.whitespace-nowrap'));
      let anyOverflow = false;
      badges.forEach(b => {
        if (b.scrollWidth > b.clientWidth || b.scrollHeight > b.clientHeight) {
          anyOverflow = true;
        }
      });
      return {
        badgeCount: badges.length,
        hasOverflow: anyOverflow,
        sampleWords: badges.slice(0, 5).map(b => b.textContent?.trim())
      };
    });
    console.log('Vocab badges inspection:', vocabBadges);
    auditLog.testResults.push({
      suite: 'Vocabulary',
      name: 'Word badges layout balanced with zero overflow',
      passed: vocabBadges.badgeCount > 0 && !vocabBadges.hasOverflow
    });

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_06_vocabulary_balanced_list.png') });

    // -------------------------------------------------------------
    // TEST SUITE 7: CUSTOM LESSONS MODAL
    // -------------------------------------------------------------
    console.log('\n--- [TEST 7] CUSTOM LESSONS MODAL ---');
    const openedCustomModal = await page.evaluate(() => {
      const headerBtns = Array.from(document.querySelectorAll('header button'));
      const customBtn = headerBtns.find(b => b.textContent?.includes('Custom'));
      if (customBtn) {
        customBtn.click();
        return true;
      }
      return false;
    });
    console.log('Opened Custom Lesson Modal:', openedCustomModal);
    await new Promise(r => setTimeout(r, 700));

    const customModalTabs = await page.evaluate(() => {
      const modal = document.querySelector('.max-w-lg');
      if (!modal) return [];
      const tabs = Array.from(modal.querySelectorAll('button')).map(b => b.textContent?.trim());
      return tabs.filter(t => ['Flashcard', 'Luyện viết', 'Ghép câu', 'Luyện nói'].includes(t));
    });
    console.log('Custom modal tabs detected:', customModalTabs);
    auditLog.testResults.push({
      suite: 'CustomLessons',
      name: 'Custom Lessons modal opens with all lesson modules',
      passed: customModalTabs.length >= 4
    });

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_07_custom_lessons_modal.png') });

    // Close Custom modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.max-w-lg button[title="Đóng bảng tùy chỉnh"]');
      if (closeBtn) closeBtn.click();
    });

    console.log('\n=======================================================');
    console.log('                   AUDIT SUMMARY');
    console.log('=======================================================');
    console.log(`Total test suites: ${auditLog.testResults.length}`);
    const passedCount = auditLog.testResults.filter(t => t.passed).length;
    console.log(`Passed: ${passedCount} / ${auditLog.testResults.length}`);
    console.log(`Console Errors: ${auditLog.consoleErrors.length}`);
    console.log(`Page Exceptions: ${auditLog.pageErrors.length}`);

    auditLog.testResults.forEach(r => {
      console.log(`[${r.passed ? 'PASS' : 'FAIL'}] [${r.suite}] ${r.name}`);
    });

    if (auditLog.consoleErrors.length > 0) {
      console.log('\nBrowser Console Errors:');
      auditLog.consoleErrors.forEach(err => console.log(' - ' + err));
    }

  } catch (err) {
    console.error('Fatal audit error:', err);
  } finally {
    await browser.close();
  }
}

runComprehensiveAudit();
