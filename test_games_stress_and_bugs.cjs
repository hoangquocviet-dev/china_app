const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = process.argv[2] || 'http://localhost:4177';

async function runGamesStressAudit() {
  console.log(`=============================================================`);
  console.log(`   ADVERSARIAL STRESS & BUG AUDIT FOR 3 ARCADE MINI-GAMES`);
  console.log(`   Target: ${TARGET_URL}`);
  console.log(`=============================================================\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=390,844'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.toString()}`));

  let passed = 0;
  let failed = 0;
  const check = (name, cond, detail = '') => {
    if (cond) {
      console.log(`[PASS] ${name}${detail ? ` -> ${detail}` : ''}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}${detail ? ` -> ${detail}` : ''}`);
      failed++;
    }
  };

  try {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    // -----------------------------------------------------------------------
    // STRESS TEST 1: Tiny 2-word Custom Deck Fallback (No Empty/Duplicate Crash)
    // -----------------------------------------------------------------------
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem(
        'hanziflow_lesson_config',
        JSON.stringify({ flashcardWordIds: ['hsk1_001', 'hsk1_002'] })
      );
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    await page.click('button[data-tab="games"]');
    await new Promise((r) => setTimeout(r, 700));

    const hubPoolInfo = await page.evaluate(() => document.body.innerText);
    check(
      'ST-1: Tiny 2-word custom deck auto-supplements >= 8 distinct words',
      hubPoolInfo.includes('Bộ từ dùng chơi (10 từ)'),
      'Supplemented to 10 distinct words'
    );

    // Reset to full deck for remaining stress tests
    await page.evaluate(() => {
      localStorage.removeItem('hanziflow_lesson_config');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 700));
    await page.click('button[data-tab="games"]');
    await new Promise((r) => setTimeout(r, 600));

    // -----------------------------------------------------------------------
    // STRESS TEST 2: Pinyin Hint Toggle (Hardcore Hanzi-only Mode)
    // -----------------------------------------------------------------------
    await page.click('[data-testid="toggle-game-pinyin"]');
    await new Promise((r) => setTimeout(r, 200));
    const pinyinToggleText = await page.evaluate(
      () => document.querySelector('[data-testid="toggle-game-pinyin"]')?.textContent || ''
    );
    check('ST-2: Pinyin toggle switches to Hidden mode', pinyinToggleText.includes('Pinyin: Ẩn'));

    await page.click('[data-testid="game-card-blitz"]');
    await new Promise((r) => setTimeout(r, 300));
    await page.click('[data-testid="blitz-start-btn"]');
    await new Promise((r) => setTimeout(r, 200));

    const hasPinyinInHardcore = await page.evaluate(() => {
      const card = document.querySelector('[data-testid="blitz-card"]');
      return card ? !!card.querySelector('.pinyin-text') : true;
    });
    check('ST-3: Blitz hides Pinyin when Hardcore mode is active', !hasPinyinInHardcore);

    // -----------------------------------------------------------------------
    // STRESS TEST 3: Blitz Synchronous Double-Click Anti-Cheat + Fever + Record
    // -----------------------------------------------------------------------
    for (let round = 0; round < 6; round++) {
      await page.evaluate(() => {
        const card = document.querySelector('[data-testid="blitz-card"]');
        if (!card) return;
        const isMatch = card.getAttribute('data-is-match') === 'true';
        const btn = document.querySelector(
          isMatch ? '[data-testid="blitz-btn-true"]' : '[data-testid="blitz-btn-false"]'
        );
        if (btn) {
          // Rapid synchronous triple-click! Should only count ONCE!
          btn.click();
          btn.click();
          btn.click();
        }
      });
      await new Promise((r) => setTimeout(r, 380));
    }

    const blitzMidState = await page.evaluate(() => document.body.innerText);
    check(
      'ST-4: Blitz synchronous triple-click guarded (Combo x6 & FEVER active)',
      blitzMidState.includes('Combo x6') && blitzMidState.includes('FEVER'),
      'Combo is exactly x6 (not x18)'
    );

    // Lose 3 lives intentionally to verify New Record badge & persistence
    for (let m = 0; m < 4; m++) {
      const done = await page.evaluate(
        () => !!document.querySelector('[data-testid="blitz-gameover"]')
      );
      if (done) break;
      await page.evaluate(() => {
        const card = document.querySelector('[data-testid="blitz-card"]');
        if (!card) return;
        const isMatch = card.getAttribute('data-is-match') === 'true';
        const wrongBtn = document.querySelector(
          isMatch ? '[data-testid="blitz-btn-false"]' : '[data-testid="blitz-btn-true"]'
        );
        if (wrongBtn) wrongBtn.click();
      });
      await new Promise((r) => setTimeout(r, 1050));
    }

    const blitzEndText = await page.evaluate(
      () => document.querySelector('[data-testid="blitz-gameover"]')?.innerText || ''
    );
    check(
      'ST-5: Blitz Game Over displays KỶ LỤC MỚI badge & accurate 6/9 (67%) stats',
      blitzEndText.includes('KỶ LỤC MỚI') && blitzEndText.includes('6/9') && blitzEndText.includes('67%')
    );

    // Return to Hub & re-enable Pinyin
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent.includes('Đổi trò chơi')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 350));
    await page.click('[data-testid="toggle-game-pinyin"]');
    await new Promise((r) => setTimeout(r, 200));

    // -----------------------------------------------------------------------
    // STRESS TEST 4: Speed Match Triple-Tap Wave Clear Race Condition Check
    // -----------------------------------------------------------------------
    await page.click('[data-testid="game-card-match"]');
    await new Promise((r) => setTimeout(r, 300));
    await page.click('[data-testid="match-start-btn"]');
    await new Promise((r) => setTimeout(r, 300));

    // Clear Wave 1 with synchronous triple-click on every matching second card!
    const wave1WordIds = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="match-card"]'));
      return Array.from(new Set(cards.map((c) => c.getAttribute('data-word-id'))));
    });
    check('ST-6: Speed Match spawns exactly 6 unique pairs (12 cards)', wave1WordIds.length === 6);

    for (const wId of wave1WordIds) {
      await page.evaluate((id) => {
        const c1 = document.querySelector(
          `[data-testid="match-card"][data-word-id="${id}"][data-card-type="hanzi"]`
        );
        const c2 = document.querySelector(
          `[data-testid="match-card"][data-word-id="${id}"][data-card-type="meaning"]`
        );
        if (c1) c1.click();
        if (c2) {
          // Triple synchronous click to test race-condition lock!
          c2.click();
          c2.click();
          c2.click();
        }
      }, wId);
      await new Promise((r) => setTimeout(r, 80));
    }

    await new Promise((r) => setTimeout(r, 650));
    const afterWave1 = await page.evaluate(() => document.body.innerText);
    check(
      'ST-7: Speed Match triple-click on final pair advances to Bàn #2 (zero double-wave skip)',
      afterWave1.includes('Bàn #2') && !afterWave1.includes('Bàn #3')
    );

    // Exit Speed Match mid-game
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent.includes('Sảnh game')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 350));

    // -----------------------------------------------------------------------
    // STRESS TEST 5: Word Runner iOS Safari 15 Canvas Polyfill + Odometer + Lv2 + Unmount
    // -----------------------------------------------------------------------
    // Delete ctx.roundRect to simulate iOS Safari 15!
    await page.evaluate(() => {
      delete CanvasRenderingContext2D.prototype.roundRect;
    });

    await page.click('[data-testid="game-card-runner"]');
    await new Promise((r) => setTimeout(r, 300));
    await page.click('[data-testid="runner-start-btn"]');

    // Cruise for 750ms without hitting a gate -> verify continuous float odometer > 0m!
    await new Promise((r) => setTimeout(r, 750));
    const cruiseMeters = await page.evaluate(() => {
      const match = document.body.innerText.match(/(\d+)m/);
      return match ? parseInt(match[1], 10) : 0;
    });
    check(
      'ST-8: Word Runner runs without ctx.roundRect (iOS Safari 15 safe) & odometer climbs smoothly during cruise',
      cruiseMeters > 0 && errors.length === 0,
      `Cruise distance = ${cruiseMeters}m`
    );

    // Clear 5 consecutive gates via Turbo Dash to verify Level Up to Lv.2!
    for (let g = 0; g < 5; g++) {
      await page.evaluate(() => {
        for (let idx = 0; idx < 3; idx++) {
          const pad = document.querySelector(`[data-testid="runner-lane-${idx}"]`);
          if (pad && pad.getAttribute('data-is-correct') === 'true') {
            pad.click();
            break;
          }
        }
        const dash = document.querySelector('[data-testid="runner-dash-btn"]');
        if (dash) {
          dash.click();
          dash.click();
        }
      });
      await new Promise((r) => setTimeout(r, 420));
    }

    const runnerLv2Text = await page.evaluate(() => document.body.innerText);
    check(
      'ST-9: Word Runner levels up to Lv.2 after clearing 5 gates',
      runnerLv2Text.includes('Lv.2')
    );

    // Crash 3 times, and on the 3rd crash exit to Hub IMMEDIATELY (<100ms) during 420ms death timer!
    for (let c = 0; c < 3; c++) {
      await page.evaluate(() => {
        for (let idx = 0; idx < 3; idx++) {
          const pad = document.querySelector(`[data-testid="runner-lane-${idx}"]`);
          if (pad && pad.getAttribute('data-is-correct') === 'false') {
            pad.click();
            break;
          }
        }
        const dash = document.querySelector('[data-testid="runner-dash-btn"]');
        if (dash) dash.click();
      });
      if (c < 2) {
        await new Promise((r) => setTimeout(r, 420));
      } else {
        // Wait just 150ms so 3rd collision triggers 420ms gameOverTimerRef, then immediately click Back!
        await new Promise((r) => setTimeout(r, 160));
        await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('button')).find((b) =>
            b.textContent.includes('Sảnh game')
          );
          if (btn) btn.click();
        });
      }
    }

    // Wait 650ms in Hub to ensure cancelled death timer didn't fire or throw errors!
    await new Promise((r) => setTimeout(r, 650));
    const backInHub = await page.evaluate(
      () => !!document.querySelector('[data-testid="game-card-runner"]')
    );
    check(
      'ST-10: Exiting Word Runner mid-death animation cancels gameOverTimer cleanly with 0 leaks',
      backInHub && errors.length === 0
    );

    // Verify SRS box progression & persisted game scores in localStorage
    const persistedStats = await page.evaluate(() => {
      const gs = JSON.parse(localStorage.getItem('hanziflow_game_scores') || '{}');
      const words = JSON.parse(localStorage.getItem('hanziflow_words') || '[]');
      const upgradedSrsCount = words.filter((w) => (w.box || 1) > 1).length;
      return { gs, upgradedSrsCount };
    });
    check(
      'ST-11: High scores & SRS Leitner boxes persisted in localStorage',
      persistedStats.gs.blitzBestScore > 0 && persistedStats.upgradedSrsCount >= 6,
      `blitzBest=${persistedStats.gs.blitzBestScore}, SRS upgraded words=${persistedStats.upgradedSrsCount}`
    );

    check('ST-12: Zero console.error & zero pageerror exceptions across entire stress run', errors.length === 0);

    console.log(`\n=============================================================`);
    console.log(`   STRESS AUDIT RESULT: ${passed} PASSED, ${failed} FAILED`);
    console.log(`=============================================================`);
    if (failed > 0) process.exit(1);
  } finally {
    await browser.close();
  }
}

runGamesStressAudit().catch((err) => {
  console.error('Fatal error in stress audit:', err);
  process.exit(1);
});
