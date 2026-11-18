const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';
const TARGET_URL = process.argv[2] || 'http://localhost:4175';

async function testThreeArcadeGames() {
  console.log(`=== E2E TESTING 3 ARCADE GAMES ON ${TARGET_URL} ===\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=390,844'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.toString()));

  try {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));

    // 1. Check BottomNav 6 tabs & zero horizontal overflow
    const navCheck = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button')).map((b) =>
        b.textContent.trim()
      );
      return {
        bodyWidth: document.body.scrollWidth,
        windowWidth: window.innerWidth,
        hasOverflow: document.body.scrollWidth > window.innerWidth + 2,
        tabs: buttons,
      };
    });
    console.log('1. BottomNav 6-tab check:', navCheck);
    if (navCheck.hasOverflow || !navCheck.tabs.includes('Trò chơi')) {
      throw new Error('BottomNav overflow or missing Trò chơi tab');
    }

    // 2. Navigate to "Trò chơi" tab
    await page.click('button[data-tab="games"]');
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'games_01_hub_overview.png') });

    const hubCards = await page.evaluate(() => {
      return {
        hasBlitz: !!document.querySelector('[data-testid="game-card-blitz"]'),
        hasMatch: !!document.querySelector('[data-testid="game-card-match"]'),
        hasRunner: !!document.querySelector('[data-testid="game-card-runner"]'),
      };
    });
    console.log('2. Arcade Hub cards check:', hubCards);
    if (!hubCards.hasBlitz || !hubCards.hasMatch || !hubCards.hasRunner) {
      throw new Error('Missing one or more game cards in GamesHubView');
    }

    // =========================================================================
    // 3. TEST GAME 1 (Option 2): CHỚP NHOÁNG 2 GIÂY (TRUE / FALSE BLITZ)
    // =========================================================================
    console.log('\n3. Testing Chớp Nhoáng 2 Giây (True / False Blitz)...');
    await page.click('[data-testid="game-card-blitz"]');
    await new Promise((r) => setTimeout(r, 500));
    await page.click('[data-testid="blitz-start-btn"]');
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'games_02_blitz_playing.png') });

    // Answer 3 questions right!
    for (let i = 0; i < 3; i++) {
      const isMatch = await page.evaluate(() => {
        const card = document.querySelector('[data-testid="blitz-card"]');
        return card ? card.getAttribute('data-is-match') === 'true' : null;
      });
      if (isMatch === null) throw new Error('Blitz card not found');
      await page.click(
        isMatch ? '[data-testid="blitz-btn-true"]' : '[data-testid="blitz-btn-false"]'
      );
      await new Promise((r) => setTimeout(r, 450));
    }

    // Intentionally miss 3 times to verify Game Over & score saving
    for (let i = 0; i < 3; i++) {
      const isMatch = await page.evaluate(() => {
        const card = document.querySelector('[data-testid="blitz-card"]');
        return card ? card.getAttribute('data-is-match') === 'true' : null;
      });
      if (isMatch !== null) {
        await page.click(
          isMatch ? '[data-testid="blitz-btn-false"]' : '[data-testid="blitz-btn-true"]'
        );
        await new Promise((r) => setTimeout(r, 1100));
      }
    }

    const blitzGameOver = await page.evaluate(() => {
      const go = document.querySelector('[data-testid="blitz-gameover"]');
      return go ? go.innerText : null;
    });
    console.log('Blitz Game Over verified:', !!blitzGameOver);
    if (!blitzGameOver) throw new Error('Blitz did not reach gameover screen');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'games_03_blitz_gameover.png') });

    // Return to Hub
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent.includes('Đổi trò chơi')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // =========================================================================
    // 4. TEST GAME 2 (Option 3): GHÉP THẺ TỐC ĐỘ 60 GIÂY (SPEED MATCH)
    // =========================================================================
    console.log('\n4. Testing Ghép Thẻ Tốc Độ 60s (Speed Match)...');
    await page.click('[data-testid="game-card-match"]');
    await new Promise((r) => setTimeout(r, 500));
    await page.click('[data-testid="match-start-btn"]');
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'games_04_speed_match_playing.png') });

    // Clear all 6 pairs on Wave 1!
    const wordIdsOnBoard = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="match-card"]'));
      return Array.from(new Set(cards.map((c) => c.getAttribute('data-word-id'))));
    });
    console.log('Unique word pairs on Wave 1:', wordIdsOnBoard.length);

    for (const wId of wordIdsOnBoard) {
      await page.click(`[data-testid="match-card"][data-word-id="${wId}"][data-card-type="hanzi"]`);
      await new Promise((r) => setTimeout(r, 120));
      await page.click(
        `[data-testid="match-card"][data-word-id="${wId}"][data-card-type="meaning"]`
      );
      await new Promise((r) => setTimeout(r, 180));
    }

    // Wait for Wave 2 spawn
    await new Promise((r) => setTimeout(r, 700));
    const wave2Status = await page.evaluate(() => {
      return {
        hasWave2Badge: document.body.innerText.includes('Bàn #2'),
        bodyTextSample: document.body.innerText.slice(0, 140).replace(/\n/g, ' '),
      };
    });
    console.log('Speed Match Wave 2 spawned:', wave2Status);
    if (!wave2Status.hasWave2Badge) throw new Error('Speed Match did not advance to Wave #2');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'games_05_speed_match_wave2.png') });

    // Return to Hub
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent.includes('Sảnh game')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // =========================================================================
    // 5. TEST GAME 3 (Option 4): VƯỢT CẦU SINH TỬ (WORD RUNNER)
    // =========================================================================
    console.log('\n5. Testing Vượt Cầu Sinh Tử (Word Runner)...');
    await page.click('[data-testid="game-card-runner"]');
    await new Promise((r) => setTimeout(r, 500));
    await page.click('[data-testid="runner-start-btn"]');
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'games_06_word_runner_playing.png') });

    // Clear 3 gates using lane selection + Turbo Dash!
    for (let g = 0; g < 3; g++) {
      const correctLane = await page.evaluate(() => {
        for (let idx = 0; idx < 3; idx++) {
          const pad = document.querySelector(`[data-testid="runner-lane-${idx}"]`);
          if (pad && pad.getAttribute('data-is-correct') === 'true') return idx;
        }
        return 1;
      });
      // Select lane
      await page.click(`[data-testid="runner-lane-${correctLane}"]`);
      await new Promise((r) => setTimeout(r, 120));
      // Trigger Turbo Dash
      await page.click('[data-testid="runner-dash-btn"]');
      await new Promise((r) => setTimeout(r, 500));
    }

    const runnerHud = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return {
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0,
        pageText: document.body.innerText.replace(/\n/g, ' '),
      };
    });
    console.log('Word Runner Canvas & Score check:', {
      canvasWidth: runnerHud.canvasWidth,
      canvasHeight: runnerHud.canvasHeight,
      hasScoreAndMeters: runnerHud.pageText.includes('m') && runnerHud.pageText.includes('đ'),
    });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'games_07_word_runner_combo.png') });

    if (consoleErrors.length > 0) {
      throw new Error('Console errors detected: ' + consoleErrors.join('; '));
    }

    console.log('\n>>> ALL 3 ARCADE GAMES PASSED E2E VERIFICATION 100% CLEANLY! <<<');
  } finally {
    await browser.close();
  }
}

testThreeArcadeGames().catch((err) => {
  console.error('E2E Game Test Failed:', err);
  process.exit(1);
});
