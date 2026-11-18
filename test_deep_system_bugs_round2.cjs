const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = process.argv[2] || 'http://localhost:4179';

async function runSystemDeepBugSuite() {
  console.log(`=============================================================`);
  console.log(`   SYSTEM-WIDE DEEP BUG REGRESSION SUITE (ROUND 2)`);
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
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    // -----------------------------------------------------------------------
    // SYS-1: AssemblyView preserves exercise index & tokens across Header re-renders
    // -----------------------------------------------------------------------
    await page.click('button[data-tab="assembly"]');
    await new Promise((r) => setTimeout(r, 700));

    // Advance to Bài tập 2
    await page.evaluate(() => {
      const nextBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Câu tiếp theo')
      );
      if (nextBtn) nextBtn.click();
    });
    await new Promise((r) => setTimeout(r, 250));

    // Pick 1 token into upper tray
    await page.evaluate(() => {
      const bankBtns = Array.from(document.querySelectorAll('.min-h-\\[90px\\] button'));
      if (bankBtns[0]) bankBtns[0].click();
    });
    await new Promise((r) => setTimeout(r, 200));

    // Trigger Header Sound toggle (causes App re-render)
    await page.click('button[aria-label="Toggle Sound"]');
    await page.click('button[aria-label="Toggle Sound"]');
    await new Promise((r) => setTimeout(r, 250));

    const assemblyAfterRender = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasResetBtn = text.includes('Làm lại');
      return { onEx2: text.includes('Bài tập 2 /'), hasSelectedToken: hasResetBtn };
    });
    check(
      'SYS-1: AssemblyView preserves exercise #2 & picked tokens across Header re-renders',
      assemblyAfterRender.onEx2 && assemblyAfterRender.hasSelectedToken
    );

    // -----------------------------------------------------------------------
    // SYS-2: Modal Keyboard Isolation Over Active Game (Space, A, D, 1, 2, 3)
    // -----------------------------------------------------------------------
    await page.click('button[data-tab="games"]');
    await new Promise((r) => setTimeout(r, 500));
    await page.click('[data-testid="game-card-runner"]');
    await new Promise((r) => setTimeout(r, 250));
    await page.click('[data-testid="runner-start-btn"]');
    await new Promise((r) => setTimeout(r, 300));

    // Open Custom Lesson Modal while Word Runner is actively playing!
    await page.click('[data-testid="header-custom-lesson-btn"]');
    await new Promise((r) => setTimeout(r, 500));

    const modalSearch = await page.$('.fixed.inset-0 input[placeholder*="Lọc từ"]');
    let typedValue = '';
    if (modalSearch) {
      await modalSearch.click();
      await modalSearch.type('ban da cau 123', { delay: 15 });
      typedValue = await page.evaluate(
        (el) => el.value,
        modalSearch
      );
    }
    check(
      'SYS-2: Typing Space/A/D/1/2/3 inside Custom Modal works cleanly over active Word Runner',
      typedValue === 'ban da cau 123',
      `Input value="${typedValue}"`
    );

    // Close Custom Modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Đóng bảng tùy chỉnh"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // -----------------------------------------------------------------------
    // SYS-3 & SYS-4: Flashcard Modal Key Isolation & Downward Swipe Flip (No Reload)
    // -----------------------------------------------------------------------
    await page.click('button[data-tab="flashcard"]');
    await new Promise((r) => setTimeout(r, 400));

    // Open Custom Modal over Flashcard and press ArrowRight & Space on a modal button
    await page.click('[data-testid="header-custom-lesson-btn"]');
    await new Promise((r) => setTimeout(r, 350));
    await page.focus('[data-testid="modal-tab-writing"]');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    await new Promise((r) => setTimeout(r, 200));

    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Đóng bảng tùy chỉnh"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    const masteredAfterModalKeys = await page.evaluate(() => {
      const ids = JSON.parse(localStorage.getItem('hanziflow_flashcard_mastered_ids') || '[]');
      return ids.length;
    });
    check(
      'SYS-3: Pressing ArrowRight/Space inside Modal does NOT master Flashcards underneath',
      masteredAfterModalKeys === 0
    );

    // Test downward vertical swipe on Flashcard (.perspective-1000) -> flips card WITHOUT page reload!
    await page.evaluate(() => {
      window.__NO_RELOAD_MARKER__ = 'ALIVE_123';
    });
    const cardRect = await page.evaluate(() => {
      const el = document.querySelector('.perspective-1000');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { cx: r.x + r.width / 2, topY: r.y + 40, botY: r.y + 240 };
    });

    if (cardRect) {
      const cdp = await page.target().createCDPSession();
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: cardRect.cx, y: cardRect.topY }],
      });
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: cardRect.cx, y: cardRect.botY }],
      });
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      });
    }
    await new Promise((r) => setTimeout(r, 500));

    const afterDownSwipe = await page.evaluate(() => ({
      marker: window.__NO_RELOAD_MARKER__,
      flipped: !!document.querySelector('.rotate-x-180'),
    }));
    check(
      'SYS-4: Swiping DOWN 200px on Flashcard flips card without triggering Pull-to-Refresh reload',
      afterDownSwipe.marker === 'ALIVE_123' && afterDownSwipe.flipped
    );

    // -----------------------------------------------------------------------
    // SYS-5: Deleting a Word Prunes Orphaned IDs from lessonConfig
    // -----------------------------------------------------------------------
    await page.evaluate(() => {
      localStorage.setItem(
        'hanziflow_lesson_config',
        JSON.stringify({ flashcardWordIds: ['hsk1_001', 'hsk1_002'] })
      );
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    await page.click('button[data-tab="library"]');
    await new Promise((r) => setTimeout(r, 500));

    await page.evaluate(() => {
      window.confirm = () => true;
      const cards = Array.from(document.querySelectorAll('.space-y-2\\.5 > div'));
      const woCard = cards.find(
        (c) => c.querySelector('.hanzi-badge')?.textContent?.trim() === '我'
      );
      const delBtn = woCard?.querySelector('button[title="Xóa từ này"]');
      if (delBtn) delBtn.click();
    });
    await new Promise((r) => setTimeout(r, 350));

    const prunedCfg = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('hanziflow_lesson_config') || '{}')
    );
    check(
      'SYS-5: Deleting word prunes its ID from lessonConfig.flashcardWordIds',
      Array.isArray(prunedCfg.flashcardWordIds) &&
        prunedCfg.flashcardWordIds.length === 1 &&
        prunedCfg.flashcardWordIds[0] === 'hsk1_002'
    );

    // -----------------------------------------------------------------------
    // SYS-6: HanziWriter Filters Punctuation & Clears initialWordId After Consuming
    // -----------------------------------------------------------------------
    await page.evaluate(() => {
      const addBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Tìm & Thêm từ vựng')
      );
      if (addBtn) addBtn.click();
    });
    await new Promise((r) => setTimeout(r, 350));

    await page.evaluate(() => {
      const customTab = Array.from(document.querySelectorAll('.fixed.inset-0 button')).find((b) =>
        b.textContent?.includes('Tự nhập từ mới')
      );
      if (customTab) customTab.click();
    });
    await new Promise((r) => setTimeout(r, 250));

    const inputs = await page.$$('.fixed.inset-0 form input');
    // Order: [0]=QuickViet, [1]=Hanzi, [2]=Pinyin, [3]=Hanviet, [4]=Meaning
    if (inputs.length >= 5) {
      await inputs[1].type('你好！');
      await inputs[2].type('nǐ hǎo');
      await inputs[4].type('Xin chào cảm thán');
      await page.evaluate(() => {
        const submitBtn = document.querySelector('.fixed.inset-0 form button[type="submit"]');
        if (submitBtn) submitBtn.click();
      });
      await new Promise((r) => setTimeout(r, 350));
      await page.evaluate(() => {
        const closeBtn = document.querySelector('.fixed.inset-0 button[title="Đóng"]');
        if (closeBtn) closeBtn.click();
      });
      await new Promise((r) => setTimeout(r, 300));
    }

    // Click "Luyện viết từ này" on "你好！"
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.space-y-2\\.5 > div'));
      const targetCard = cards.find(
        (c) => c.querySelector('.hanzi-badge')?.textContent?.trim() === '你好！'
      );
      const writeBtn = targetCard?.querySelector('button[title="Luyện viết từ này"]');
      if (writeBtn) writeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    const charTabsForPunctWord = await page.evaluate(() => {
      const charBtns = Array.from(
        document.querySelectorAll('main .flex.items-center.space-x-1\\.5 > button')
      ).map((b) => b.textContent?.trim());
      return charBtns;
    });
    check(
      'SYS-6: HanziWriter strips punctuation (！) and renders only valid CJK tabs [你, 好]',
      charTabsForPunctWord.join(',') === '你,好',
      `Tabs=[${charTabsForPunctWord.join(', ')}]`
    );

    // Advance to next word via chevron, then toggle Header Sound -> should NOT snap back to 你好！
    await page.click('button[aria-label="Từ tiếp theo"]');
    await new Promise((r) => setTimeout(r, 300));
    await page.click('button[aria-label="Toggle Sound"]');
    await new Promise((r) => setTimeout(r, 300));

    const selectedSelectIndex = await page.evaluate(() => {
      const sel = document.querySelector('select');
      return sel ? Number(sel.value) : -1;
    });
    check(
      'SYS-7: HanziWriter stays on newly browsed word across Header re-renders',
      selectedSelectIndex === 1,
      `selectIndex=${selectedSelectIndex}`
    );

    check('SYS-8: Zero console.error & zero pageerror across all tests', errors.length === 0);

    console.log(`\n=============================================================`);
    console.log(`   ROUND 2 SUITE RESULT: ${passed} PASSED, ${failed} FAILED`);
    console.log(`=============================================================`);
    if (failed > 0) process.exit(1);
  } finally {
    await browser.close();
  }
}

runSystemDeepBugSuite().catch((err) => {
  console.error('Fatal error in Round 2 suite:', err);
  process.exit(1);
});
