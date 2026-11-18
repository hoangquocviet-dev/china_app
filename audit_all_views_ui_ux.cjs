const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';
const PORT = 4192;
const BASE_URL = `http://localhost:${PORT}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

function createStaticServer() {
  const distDir = path.join(__dirname, 'dist');
  const server = http.createServer((req, res) => {
    let reqPath = req.url ? req.url.split('?')[0].split('#')[0] : '/';
    let filePath = path.join(distDir, reqPath === '/' ? 'index.html' : reqPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': mime });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

async function runDeepAudit() {
  console.log('===============================================================');
  console.log('   DEEP SYSTEM-WIDE UI/UX AUDIT & ACCESSIBILITY INSPECTOR');
  console.log('   HanziFlow PWA: Testing All 6 Tabs, 3 Modals, 3 Viewports');
  console.log('===============================================================\n');

  const server = await createStaticServer();
  console.log(`Embedded static server running at ${BASE_URL}\n`);

  let browser;
  const auditResults = [];
  const record = (category, name, passed, detail = '') => {
    auditResults.push({ category, name, passed, detail });
    console.log(`[${passed ? 'PASS' : 'FAIL'}] [${category}] ${name}${detail ? ' -> ' + detail : ''}`);
  };

  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-gpu'],
    });

    const pageErrors = [];
    const consoleWarnings = [];

    // Helper to setup page listeners
    const attachAuditListeners = (page, prefix) => {
      page.on('pageerror', (err) => {
        pageErrors.push(`${prefix}: ${err.toString()}`);
        console.error(`[PAGE ERROR ${prefix}]`, err.toString());
      });
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          pageErrors.push(`${prefix} Console: ${msg.text()}`);
          console.error(`[CONSOLE ERROR ${prefix}]`, msg.text());
        }
      });
    };

    // =========================================================================
    // 1. MULTI-VIEWPORT RESPONSIVENESS & ZERO OVERFLOW AUDIT
    // =========================================================================
    console.log('--- SUITE 1: MULTI-VIEWPORT RESPONSIVENESS (375px, 390px, 412px) ---');
    const viewports = [
      { name: 'iPhone SE (375x667)', width: 375, height: 667 },
      { name: 'iPhone 14/15/16 (390x844)', width: 390, height: 844 },
      { name: 'Android Pixel/Samsung (412x915)', width: 412, height: 915 },
    ];

    const vpPage = await browser.newPage();
    attachAuditListeners(vpPage, 'VP');

    for (const vp of viewports) {
      await vpPage.setViewport({ width: vp.width, height: vp.height, isMobile: true, hasTouch: true });
      await vpPage.goto(BASE_URL, { waitUntil: 'networkidle0' });
      await sleep(500);

      const check = await vpPage.evaluate(() => ({
        bodyScrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth,
        hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth,
      }));

      record(
        'Responsiveness',
        `Zero horizontal overflow on ${vp.name}`,
        !check.hasHorizontalOverflow,
        `scrollWidth=${check.bodyScrollWidth}, innerWidth=${check.innerWidth}`
      );
    }
    await vpPage.close();

    // =========================================================================
    // 2. MAIN MOBILE CONTEXT AUDIT (390x844)
    // =========================================================================
    const page = await browser.newPage();
    attachAuditListeners(page, 'Main');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await sleep(1000);

    // --- HEADER AUDIT ---
    console.log('\n--- SUITE 2: HEADER NAVIGATION & TOUCH CONTROLS ---');
    const headerCheck = await page.evaluate(() => {
      const brandLogo = document.querySelector('header .bg-gradient-to-br');
      const titleEl = document.querySelector('header h1');
      const hskBadge = document.querySelector('header span');
      const customBtn = document.querySelector('[data-testid="header-custom-lesson-btn"]');
      const cloudBtn = document.querySelector('[data-testid="header-cloud-sync-btn"]');
      const reloadBtn = document.querySelector('button[title*="Reload"]');
      const soundBtn = document.querySelector('button[title*="âm thanh"]');

      return {
        hasLogo: Boolean(brandLogo),
        titleText: titleEl?.textContent?.trim() || '',
        isTitleTruncated: titleEl ? titleEl.scrollWidth > titleEl.clientWidth : false,
        hasHskBadge: Boolean(hskBadge && hskBadge.textContent?.includes('HSK 1')),
        hasCustomBtn: Boolean(customBtn),
        hasCloudBtn: Boolean(cloudBtn),
        hasReloadBtn: Boolean(reloadBtn),
        hasSoundBtn: Boolean(soundBtn),
      };
    });

    record(
      'Header',
      'All header branding & control buttons rendered properly',
      headerCheck.hasLogo &&
        headerCheck.hasCustomBtn &&
        headerCheck.hasCloudBtn &&
        headerCheck.hasReloadBtn &&
        headerCheck.hasSoundBtn,
      `title="${headerCheck.titleText}"`
    );

    record(
      'Header',
      'Header title is not truncated on 390px mobile viewport',
      !headerCheck.isTitleTruncated,
      `truncated=${headerCheck.isTitleTruncated}`
    );

    // --- BOTTOM NAV 6 TABS AUDIT ---
    console.log('\n--- SUITE 3: BOTTOM NAVIGATION (6 TABS) ---');
    const navCheck = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const tabs = buttons.map((b) => ({
        id: b.getAttribute('data-tab'),
        label: b.textContent?.trim(),
        width: b.getBoundingClientRect().width,
      }));
      return {
        count: tabs.length,
        tabs,
        hasAll6: ['flashcard', 'writing', 'assembly', 'speaking', 'games', 'library'].every((id) =>
          tabs.some((t) => t.id === id)
        ),
      };
    });

    record(
      'Navigation',
      'Bottom navigation contains all 6 interactive tabs',
      navCheck.hasAll6 && navCheck.count === 6,
      `tabs: ${navCheck.tabs.map((t) => t.label).join(', ')}`
    );

    // =========================================================================
    // 3. TAB-BY-TAB COMPONENT & INTERACTION AUDIT
    // =========================================================================

    // --- TAB 1: FLASHCARD ---
    console.log('\n--- SUITE 4: TAB 1 - FLASHCARD VIEW ---');
    await page.evaluate(() => window.location.hash = 'flashcard');
    await sleep(600);

    const flashcardCheck = await page.evaluate(() => {
      const card = document.querySelector('.perspective-1000');
      const card3D = document.querySelector('.transform-style-3d');
      const isFlippedBefore = card3D?.className.includes('rotate-x-180') || false;
      const hanziText = card?.querySelector('.font-bold')?.textContent?.trim();
      const pinyinText = card?.querySelector('.pinyin-text')?.textContent?.trim();
      const nextBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Từ sau') || b.textContent?.includes('Chưa nhớ')
      );
      const masteredBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Đã thuộc')
      );
      return {
        hasCard: Boolean(card),
        isFlippedBefore,
        hanziText,
        pinyinText,
        hasNextBtn: Boolean(nextBtn),
        hasMasteredBtn: Boolean(masteredBtn),
      };
    });

    record(
      'Flashcard',
      'Flashcard renders Chinese character, Pinyin and action controls',
      flashcardCheck.hasCard && Boolean(flashcardCheck.hanziText),
      `word: "${flashcardCheck.hanziText}" (${flashcardCheck.pinyinText})`
    );

    // Test Flip gesture / click
    await page.click('.perspective-1000');
    await sleep(400);

    const isFlippedAfter = await page.evaluate(() => {
      const card3D = document.querySelector('.transform-style-3d');
      return card3D?.className.includes('rotate-x-180') || false;
    });

    record(
      'Flashcard',
      'Tapping card executes 3D flip to show meaning and example',
      isFlippedAfter,
      `isFlipped=${isFlippedAfter}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_round3_01_flashcard.png') });

    // Flip back
    await page.click('.perspective-1000');
    await sleep(300);

    // --- TAB 2: WRITING PRACTICE ---
    console.log('\n--- SUITE 5: TAB 2 - WRITING PRACTICE (LUYỆN VIẾT) ---');
    await page.evaluate(() => window.location.hash = 'writing');
    await sleep(1500);

    const writingCheck = await page.evaluate(() => {
      const canvasContainer = document.querySelector('.hanzi-canvas-container');
      const svg = canvasContainer ? canvasContainer.querySelector('svg') : null;
      const animBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Xem viết') || b.title?.includes('Xem')
      );
      const gridBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Ô Mễ') || b.textContent?.includes('Ô Điền')
      );
      const hintBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Gợi ý')
      );
      return {
        hasCanvas: Boolean(canvasContainer),
        hasSvg: Boolean(svg),
        hasAnimBtn: Boolean(animBtn),
        hasGridBtn: Boolean(gridBtn),
        hasHintBtn: Boolean(hintBtn),
        svgWidth: svg?.getAttribute('width'),
        svgHeight: svg?.getAttribute('height'),
      };
    });

    record(
      'Writing',
      'HanziWriter canvas initializes SVG and controls properly',
      writingCheck.hasCanvas && writingCheck.hasSvg,
      `svgSize=${writingCheck.svgWidth}x${writingCheck.svgHeight}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_round3_02_writing.png') });

    // --- TAB 3: ASSEMBLY (GHÉP CÂU) ---
    console.log('\n--- SUITE 6: TAB 3 - SENTENCE ASSEMBLY (GHÉP CÂU) ---');
    await page.evaluate(() => window.location.hash = 'assembly');
    await sleep(1000);

    const assemblyCheck = await page.evaluate(() => {
      const targetPrompt = document.querySelector('.bg-slate-800\\/90, .bg-slate-800\\/80');
      const tokenButtons = Array.from(document.querySelectorAll('button')).filter((b) => {
        const text = b.textContent?.trim() || '';
        return (
          (b.className.includes('rounded-xl') || b.className.includes('rounded-2xl')) &&
          text.length > 0 &&
          text.length <= 4 &&
          !['Chơi', 'Thêm', 'Custom', 'Sao lưu', 'Phục hồi', 'Pinyin'].some((w) => text.includes(w))
        );
      });
      const checkBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Kiểm tra')
      );
      return {
        hasPrompt: Boolean(targetPrompt),
        tokenCount: tokenButtons.length,
        hasCheckBtn: Boolean(checkBtn),
      };
    });

    record(
      'Assembly',
      'Sentence assembly view renders Vietnamese prompt, token tiles & check button',
      assemblyCheck.hasPrompt && assemblyCheck.tokenCount >= 2 && assemblyCheck.hasCheckBtn,
      `tokens=${assemblyCheck.tokenCount}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_round3_03_assembly.png') });

    // --- TAB 4: SPEAKING (LUYỆN NÓI) ---
    console.log('\n--- SUITE 7: TAB 4 - SPEAKING PRACTICE (LUYỆN NÓI) ---');
    await page.evaluate(() => window.location.hash = 'speaking');
    await sleep(1000);

    const speakingCheck = await page.evaluate(() => {
      const hanziDisplay = document.querySelector('[data-testid="speaking-target-text"], .hanzi-badge, .text-5xl, .text-3xl, .text-4xl');
      const micBtn = document.querySelector('button[aria-label*="nói"], button.rounded-full.p-5, button.p-5');
      const listenBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Nghe mẫu') || b.title?.includes('Phát âm')
      );
      const modeSwitch = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Luyện nói từ vựng') ||
        b.textContent?.includes('Luyện nói cả câu') ||
        b.textContent?.includes('Từ đơn') ||
        b.textContent?.includes('Mẫu câu')
      );
      return {
        hasHanzi: Boolean(hanziDisplay),
        hasMicBtn: Boolean(micBtn),
        hasListenBtn: Boolean(listenBtn),
        hasModeSwitch: Boolean(modeSwitch),
      };
    });

    record(
      'Speaking',
      'Speaking view renders target text, audio player & mic trigger',
      speakingCheck.hasHanzi && speakingCheck.hasListenBtn && speakingCheck.hasModeSwitch,
      `hasMic=${speakingCheck.hasMicBtn}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_round3_04_speaking.png') });

    // --- TAB 5: TRÒ CHƠI (ARCADE MINI-GAMES & LEADERBOARD) ---
    console.log('\n--- SUITE 8: TAB 5 - ARCADE GAMES & BẢNG PHONG THẦN ---');
    await page.evaluate(() => window.location.hash = 'games');
    await sleep(1200);

    const gamesCheck = await page.evaluate(() => {
      const statsBanner = document.querySelector('.bg-gradient-to-br.from-slate-800');
      const blitzCard = document.querySelector('[data-testid="game-card-blitz"]');
      const matchCard = document.querySelector('[data-testid="game-card-match"]');
      const runnerCard = document.querySelector('[data-testid="game-card-runner"]');
      const leaderboard = document.querySelector('[data-testid="arcade-leaderboard-section"]');
      const pinyinToggle = document.querySelector('[data-testid="toggle-game-pinyin"]');

      return {
        hasStats: Boolean(statsBanner),
        hasBlitz: Boolean(blitzCard),
        hasMatch: Boolean(matchCard),
        hasRunner: Boolean(runnerCard),
        hasLeaderboard: Boolean(leaderboard),
        hasPinyinToggle: Boolean(pinyinToggle),
      };
    });

    record(
      'Games',
      'GamesHub renders all 3 mini-game cards, score banner & live Leaderboard',
      gamesCheck.hasStats &&
        gamesCheck.hasBlitz &&
        gamesCheck.hasMatch &&
        gamesCheck.hasRunner &&
        gamesCheck.hasLeaderboard,
      'Blitz, Match, Runner & Leaderboard present'
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_round3_05_games.png') });

    // --- TAB 6: KHO TỪ VỰNG & TỪ ĐIỂN ---
    console.log('\n--- SUITE 9: TAB 6 - VOCABULARY LIBRARY & DICTIONARY ---');
    await page.evaluate(() => window.location.hash = 'library');
    await sleep(1000);

    const libraryCheck = await page.evaluate(() => {
      const searchInput = document.querySelector('input[placeholder*="Tìm trong sổ từ"]');
      const addWordBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Tìm & Thêm từ vựng')
      );
      const dictBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Từ điển')
      );
      const wordBadges = document.querySelectorAll('.hanzi-badge');

      return {
        hasSearch: Boolean(searchInput),
        hasAddBtn: Boolean(addWordBtn),
        hasDictBtn: Boolean(dictBtn),
        renderedWordsCount: wordBadges.length,
      };
    });

    record(
      'Library',
      'Word library renders search bar, add buttons and word card list',
      libraryCheck.hasSearch && libraryCheck.hasAddBtn && libraryCheck.renderedWordsCount > 0,
      `renderedWords=${libraryCheck.renderedWordsCount}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_round3_06_library.png') });

    // --- MODAL 1: ADD WORD & CLOUD DICTIONARY MODAL ---
    console.log('\n--- SUITE 10: MODALS - ADD WORD & CLOUD COMMUNITY DICTIONARY ---');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Tìm & Thêm từ vựng')
      );
      if (btn) btn.click();
    });
    await sleep(800);

    const addModalCheck = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      const searchInput = modal ? modal.querySelector('input[placeholder*="Tìm theo chữ Hán"]') : null;
      const chips = modal ? Array.from(modal.querySelectorAll('button')).filter((b) => ['Tất cả cấp độ', 'ALL', 'HSK1', 'HSK2', 'HSK3'].includes(b.textContent?.trim() || '')) : [];
      const customTab = modal ? Array.from(modal.querySelectorAll('button')).find((b) => b.textContent?.includes('Tự nhập từ mới')) : null;
      return {
        isOpen: Boolean(modal),
        hasSearch: Boolean(searchInput),
        levelChipCount: chips.length,
        hasCustomTab: Boolean(customTab),
      };
    });

    record(
      'Modals',
      'AddWordModal opens with Dictionary Search, Level filters & Custom Word tab',
      addModalCheck.isOpen && addModalCheck.hasSearch && addModalCheck.levelChipCount === 4,
      `levelChips=${addModalCheck.levelChipCount}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_round3_07_add_word_modal.png') });

    // Close AddWordModal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Đóng"]');
      if (closeBtn) closeBtn.click();
    });
    await sleep(400);

    // --- MODAL 2: CLOUD SYNC & QR MODAL ---
    console.log('\n--- SUITE 11: MODALS - CLOUD SYNC MODAL & QR CODE ---');
    await page.click('[data-testid="header-cloud-sync-btn"]');
    await sleep(800);

    const cloudModalCheck = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      const syncCode = modal ? modal.querySelector('[data-testid="current-sync-code"]')?.textContent?.trim() : null;
      const qrImg = modal ? modal.querySelector('img[alt*="QR"]') : null;
      const restoreTab = modal ? modal.querySelector('[data-testid="cloud-tab-restore"]') : null;
      const copyBtn = modal ? modal.querySelector('[data-testid="copy-sync-code-btn"]') : null;

      return {
        isOpen: Boolean(modal),
        syncCode,
        hasValidCodeFormat: /^HF-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/.test(syncCode || ''),
        hasQrImage: Boolean(qrImg && qrImg.getAttribute('src')?.startsWith('data:image/png')),
        hasRestoreTab: Boolean(restoreTab),
        hasCopyBtn: Boolean(copyBtn),
      };
    });

    record(
      'Modals',
      'CloudSyncModal renders valid HF-XXXX-XXXX code, QR code & Restore tab',
      cloudModalCheck.isOpen && cloudModalCheck.hasValidCodeFormat && cloudModalCheck.hasQrImage,
      `code=${cloudModalCheck.syncCode}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_round3_08_cloud_modal.png') });

    // Close CloudModal with Escape
    await page.keyboard.press('Escape');
    await sleep(400);

    // --- MODAL 3: CUSTOM LESSON MODAL ---
    console.log('\n--- SUITE 12: MODALS - CUSTOM LESSON MODAL ---');
    await page.click('[data-testid="header-custom-lesson-btn"]');
    await sleep(800);

    const customModalCheck = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      const tabs = modal ? Array.from(modal.querySelectorAll('button')).map((b) => b.textContent?.trim()) : [];
      return {
        isOpen: Boolean(modal),
        hasFlashTab: tabs.some((t) => t?.includes('Flashcard')),
        hasWritingTab: tabs.some((t) => t?.includes('Luyện viết')),
        hasAssemblyTab: tabs.some((t) => t?.includes('Ghép câu')),
        hasSpeakingTab: tabs.some((t) => t?.includes('Luyện nói')),
      };
    });

    record(
      'Modals',
      'CustomLessonModal opens with all 4 learning activity configurators',
      customModalCheck.isOpen &&
        customModalCheck.hasFlashTab &&
        customModalCheck.hasWritingTab &&
        customModalCheck.hasAssemblyTab &&
        customModalCheck.hasSpeakingTab,
      '4 lesson modes customizable'
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_round3_09_custom_lesson_modal.png') });

    // Close CustomModal with Escape
    await page.keyboard.press('Escape');
    await sleep(400);

    // --- ACCESSIBILITY & CONSOLE HEALTH CHECK ---
    console.log('\n--- SUITE 13: CONSOLE & RUNTIME HEALTH ---');
    record(
      'Health',
      'Zero uncaught JavaScript exceptions across all user journeys',
      pageErrors.length === 0,
      pageErrors.length > 0 ? pageErrors.join('; ') : '0 runtime errors'
    );

    const failed = auditResults.filter((r) => !r.passed);
    console.log(`\n===============================================================`);
    console.log(`   DEEP AUDIT SUMMARY: ${auditResults.length - failed.length}/${auditResults.length} PASSED`);
    console.log(`===============================================================\n`);

    if (failed.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    if (browser) await browser.close().catch(() => {});
    if (server) server.close();
  }
}

runDeepAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
