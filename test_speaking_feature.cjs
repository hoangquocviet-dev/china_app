const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function testSpeakingFeature(targetUrl) {
  console.log(`=== TESTING SPEAKING FEATURE ON ${targetUrl} ===\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--window-size=390,844']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const consoleErrors = [];
  page.on('console', msg => {
    console.log(`[PAGE LOG ${msg.type()}]:`, msg.text());
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.toString()));

  try {
    // 1. Navigate to Speaking tab
    console.log('1. Navigating to speaking tab...');
    await page.goto(`${targetUrl}/#speaking`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Verify Tab Title & Subtitle in Header
    const headerInfo = await page.evaluate(() => {
      const h1 = document.querySelector('header h1')?.textContent?.trim();
      const p = document.querySelector('header p')?.textContent?.trim();
      return { title: h1, subtitle: p };
    });
    console.log('   Header Info:', headerInfo);

    // Verify Bottom Navigation has "Luyện nói"
    const navText = await page.evaluate(() => {
      const activeNavBtn = document.querySelector('nav button.text-rose-500');
      return activeNavBtn ? activeNavBtn.textContent.trim() : null;
    });
    console.log('   Active Tab Nav Label:', navText);

    // 2. Word Speaking Mode UI Verification
    console.log('\n2. Verifying Word Speaking Mode UI...');
    const wordInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim());
      const texts = Array.from(document.querySelectorAll('div')).map(d => d.textContent?.trim());
      return {
        buttons: buttons.filter(Boolean),
        hasListenBtn: buttons.some(b => b && b.includes('Nghe mẫu')),
        hasSlowListenBtn: buttons.some(b => b && b.includes('Nghe chậm')),
        hasMicBtn: document.querySelector('button[title*="bắt đầu nói"]') !== null || document.querySelector('button[title*="ghi âm"]') !== null,
      };
    });
    console.log('   Word UI Elements:', {
      hasListenBtn: wordInfo.hasListenBtn,
      hasSlowListenBtn: wordInfo.hasSlowListenBtn,
      hasMicBtn: wordInfo.hasMicBtn
    });

    const screenshot1 = path.join(ARTIFACT_DIR, 'speaking_01_word_view.png');
    await page.screenshot({ path: screenshot1 });
    console.log(`   Captured: ${screenshot1}`);

    // 3. Test "Nghe mẫu" and "Nghe chậm" clicks
    console.log('\n3. Testing Native Audio Listen buttons...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const sampleBtn = btns.find(b => b.textContent && b.textContent.includes('Nghe mẫu'));
      if (sampleBtn) sampleBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const slowBtn = btns.find(b => b.textContent && b.textContent.includes('Nghe chậm'));
      if (slowBtn) slowBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    console.log('   Listen buttons clicked successfully without error.');

    // 4. Test Microphone Speech Recognition & Scoring
    console.log('\n4. Testing Microphone & Speech Evaluation...');
    // Set mock speech to match the current target word '学习'
    await page.evaluate(() => {
      window.__MOCK_SPEECH__ = '学习';
    });

    // Click microphone button to start recording
    await page.click('button[data-testid="speaking-mic-btn"]');
    console.log('   Recording started, waiting for recognition & evaluation...');
    await new Promise(r => setTimeout(r, 2000));

    const evalResult = await page.evaluate(() => {
      const scoreBadge = document.querySelector('.text-emerald-400, .text-amber-300');
      const feedback = document.querySelector('.text-slate-400')?.textContent?.trim();
      const playUserAudioBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Nghe lại giọng'));
      const recognizedTextEl = Array.from(document.querySelectorAll('.select-all')).find(el => el.textContent && el.textContent.includes('学习'));
      return {
        hasEvalBox: Boolean(scoreBadge || playUserAudioBtn || recognizedTextEl),
        score: scoreBadge ? scoreBadge.textContent.trim() : null,
        feedback,
        hasUserPlaybackBtn: Boolean(playUserAudioBtn),
        recognizedText: recognizedTextEl ? recognizedTextEl.textContent.trim() : null
      };
    });
    console.log('   Evaluation Result:', evalResult);

    const screenshot2 = path.join(ARTIFACT_DIR, 'speaking_02_word_evaluated.png');
    await page.screenshot({ path: screenshot2 });
    console.log(`   Captured: ${screenshot2}`);

    // Test Play User Audio if available
    if (evalResult.hasUserPlaybackBtn) {
      console.log('   Clicking "Nghe lại giọng"...');
      await page.evaluate(() => {
        const playBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Nghe lại giọng'));
        if (playBtn) playBtn.click();
      });
      await new Promise(r => setTimeout(r, 600));
    }

    // 5. Test Switch to Sentence Speaking Mode
    console.log('\n5. Switching to Sentence Speaking Mode...');
    await page.evaluate(() => {
      const sentenceModeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Luyện nói cả câu'));
      if (sentenceModeBtn) sentenceModeBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const sentenceInfo = await page.evaluate(() => {
      const counter = Array.from(document.querySelectorAll('span')).find(s => s.textContent && s.textContent.includes('Câu 1 /'));
      const buttons = Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim());
      return {
        counterText: counter?.textContent?.trim(),
        hasListenBtn: buttons.some(b => b && b.includes('Nghe mẫu')),
        hasNextBtn: buttons.some(b => b && b.includes('Câu sau')),
      };
    });
    console.log('   Sentence Mode Info:', sentenceInfo);

    // Click "Câu sau"
    await page.evaluate(() => {
      const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Câu sau'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const screenshot3 = path.join(ARTIFACT_DIR, 'speaking_03_sentence_view.png');
    await page.screenshot({ path: screenshot3 });
    console.log(`   Captured: ${screenshot3}`);

    console.log('\n=== TEST SUMMARY ===');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }

    return {
      success: consoleErrors.length === 0 && headerInfo.title.includes('Luyện Nói') && evalResult.hasEvalBox,
      headerInfo,
      evalResult,
      sentenceInfo,
    };
  } finally {
    await browser.close();
  }
}

// Check if URL provided in CLI args or default
const url = process.argv[2] || 'http://localhost:4173';
testSpeakingFeature(url).then(res => {
  console.log('\nFinal Test Result:', res);
  process.exit(res.success ? 0 : 1);
}).catch(err => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
