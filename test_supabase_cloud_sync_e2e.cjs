const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';
const PORT = 4188;
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

async function runCloudE2E() {
  console.log('=== STARTING LIVE SUPABASE CLOUD SYNC & LEADERBOARD E2E TEST ===');

  const server = await createStaticServer();
  console.log(`Preview server ready at ${BASE_URL}`);

  let browser;
  let syncCodeA = '';
  const results = [];
  const record = (name, pass, detail = '') => {
    results.push({ name, pass, detail });
    console.log(`${pass ? '[PASS]' : '[FAIL]'} ${name}${detail ? ' -> ' + detail : ''}`);
  };

  try {

    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-gpu', '--window-size=390,844'],
    });

    // =========================================================================
    // DEVICE A: Fresh User adds word, earns score, sets nickname, pushes Cloud
    // =========================================================================
    const ctxA = await browser.createBrowserContext();
    const pageA = await ctxA.newPage();
    await pageA.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    const pageErrors = [];
    pageA.on('pageerror', (e) => pageErrors.push('A: ' + e.toString()));

    await pageA.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await sleep(1000);

    // 1. Check 390px mobile header overflow with new Cloud button
    const headerLayout = await pageA.evaluate(() => ({
      scrollWidth: document.body.scrollWidth,
      innerWidth: window.innerWidth,
      hasCloudBtn: Boolean(document.querySelector('[data-testid="header-cloud-sync-btn"]')),
    }));
    record(
      'E2E-1: Mobile 390px Header Cloud button & zero horizontal overflow',
      headerLayout.hasCloudBtn && headerLayout.scrollWidth <= headerLayout.innerWidth + 1,
      `scrollWidth=${headerLayout.scrollWidth}, innerWidth=${headerLayout.innerWidth}`
    );

    // 2. Navigate to Library -> Open AddWordModal -> Create Custom Word (triggers publishCommunityWord)
    await pageA.evaluate(() => {
      window.location.hash = 'library';
    });
    await sleep(800);

    // Click "+ Thêm từ" button in WordListView
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find((b) => b.textContent && b.textContent.includes('Thêm từ'));
      if (addBtn) addBtn.click();
    });
    await sleep(500);

    // Switch to "Tự nhập từ mới" tab
    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const customTab = btns.find((b) => b.textContent && b.textContent.includes('Tự nhập từ mới'));
      if (customTab) customTab.click();
    });
    await sleep(400);

    // Fill custom word inputs
    const setReactInput = async (page, selector, val) => {
      await page.evaluate(
        ({ sel, v }) => {
          const el = document.querySelector(sel);
          if (!el) throw new Error('Missing input: ' + sel);
          const setter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
          ).set;
          setter.call(el, v);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        },
        { sel: selector, v: val }
      );
    };

    await setReactInput(pageA, 'input[placeholder*="猫"]', '云端数据库');
    await setReactInput(pageA, 'input[placeholder*="māo"]', 'yún duān shù jù kù');
    await setReactInput(pageA, 'input[placeholder*="MIÊU"]', 'VÂN ĐOAN SỐ CỨ KHỐ');
    await setReactInput(pageA, 'input[placeholder*="Con mèo"]', 'Cơ sở dữ liệu đám mây E2E');

    await pageA.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
      const saveBtn = btns.find((b) => b.textContent && b.textContent.includes('Lưu vào sổ từ vựng'));
      if (saveBtn) saveBtn.click();
    });
    await sleep(1500); // Wait for publishCommunityWord POST to Supabase

    // Close AddWordModal
    await pageA.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Đóng"]');
      if (closeBtn) closeBtn.click();
    });
    await sleep(400);

    // 3. Seed mastered flashcards + Arcade game high scores on Device A
    await pageA.evaluate(() => {
      window.localStorage.setItem(
        'hanziflow_flashcard_mastered_ids',
        JSON.stringify(['w1', 'w2', 'w3'])
      );
      window.localStorage.setItem(
        'hanziflow_game_scores',
        JSON.stringify({
          blitzBestScore: 680,
          blitzBestCombo: 14,
          matchBestScore: 420,
          matchBestWaves: 3,
          runnerBestScore: 550,
          runnerBestDistance: 480,
          totalGamesPlayed: 5,
        })
      );
    });
    // Reload Device A so storageService memoryCache loads seeded scores & mastered IDs cleanly
    await pageA.reload({ waitUntil: 'networkidle0' });
    await sleep(800);

    // 4. Open CloudSyncModal, set Nickname, verify QR code, and Push Now
    await pageA.click('[data-testid="header-cloud-sync-btn"]');
    await sleep(900);

    const modalInfoA = await pageA.evaluate(() => {
      const codeEl = document.querySelector('[data-testid="current-sync-code"]');
      const qrImg = document.querySelector('img[alt*="QR"]');
      return {
        syncCode: codeEl ? codeEl.textContent.trim() : '',
        hasQr: Boolean(qrImg && qrImg.getAttribute('src')?.startsWith('data:image/png')),
      };
    });
    syncCodeA = modalInfoA.syncCode;
    record(
      'E2E-2: Sync Code HF-XXXX-XXXX & QR Code generated on Device A',
      /^HF-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/.test(syncCodeA) && modalInfoA.hasQr,
      `syncCode=${syncCodeA}, hasQr=${modalInfoA.hasQr}`
    );

    await setReactInput(pageA, '[data-testid="nickname-input"]', 'E2E Cao Thủ HSK');
    await pageA.click('[data-testid="save-nickname-btn"]');
    await sleep(2200);

    const syncStatusA = await pageA.evaluate(() => {
      const badge = document.querySelector('[data-testid="cloud-status-badge"]');
      const banner = document.querySelector('[data-testid="cloud-feedback-banner"]');
      return {
        badgeText: badge ? badge.textContent.trim() : '',
        bannerText: banner ? banner.textContent.trim() : '',
      };
    });
    record(
      'E2E-3: Device A pushed profile, custom word & leaderboard to live Supabase',
      syncStatusA.badgeText.includes('Đã đồng bộ'),
      `badge="${syncStatusA.badgeText}"`
    );

    await pageA.screenshot({
      path: path.join(ARTIFACT_DIR, 'cloud_01_modal_synced.png'),
    });

    // =========================================================================
    // DEVICE B: Brand-New Incognito Context restores via QR Magic Link (?sync=)
    // =========================================================================
    const ctxB = await browser.createBrowserContext();
    const pageB = await ctxB.newPage();
    await pageB.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    pageB.on('pageerror', (e) => pageErrors.push('B: ' + e.toString()));

    await pageB.goto(`${BASE_URL}/?sync=${encodeURIComponent(syncCodeA)}`, {
      waitUntil: 'networkidle0',
    });
    await sleep(2200);

    const restoreCheckB = await pageB.evaluate(() => {
      const toast = document.querySelector('[data-testid="sync-magic-toast"]');
      return {
        cleanUrlSearch: window.location.search,
        toastText: toast ? toast.textContent.trim() : '',
        storedCode: window.localStorage.getItem('hanziflow_sync_code'),
        storedNick: window.localStorage.getItem('hanziflow_nickname'),
      };
    });
    record(
      'E2E-4: Device B restored via Magic QR Link (?sync=) & cleaned URL query',
      restoreCheckB.cleanUrlSearch === '' &&
        restoreCheckB.storedCode === syncCodeA &&
        restoreCheckB.storedNick === 'E2E Cao Thủ HSK' &&
        restoreCheckB.toastText.includes('Khôi phục thành công'),
      `toast="${restoreCheckB.toastText}"`
    );

    await pageB.screenshot({
      path: path.join(ARTIFACT_DIR, 'cloud_02_magic_qr_restored.png'),
    });

    // Verify custom word exists in Device B's notebook (#library)
    await pageB.evaluate(() => {
      window.location.hash = 'library';
    });
    await sleep(900);
    await setReactInput(pageB, 'input[placeholder*="Tìm trong sổ từ"]', '云端数据库');
    await sleep(500);

    const hasWordOnB = await pageB.evaluate(() =>
      document.body.innerText.includes('Cơ sở dữ liệu đám mây E2E')
    );
    record(
      'E2E-5: Custom Chinese word "云端数据库" restored in Device B notebook',
      hasWordOnB
    );

    // Verify GamesHubView shows restored 1.650 record score & live Leaderboard entry
    await pageB.evaluate(() => {
      window.location.hash = 'games';
    });
    await sleep(1800);

    const gamesCheckB = await pageB.evaluate(() => {
      const text = document.body.innerText;
      const board = document.querySelector('[data-testid="arcade-leaderboard-section"]');
      const boardText = board ? board.innerText : '';
      return {
        hasTotalRecord: text.includes('1.650') || text.includes('1,650'),
        hasPlayerOnBoard: boardText.includes('E2E Cao Thủ HSK'),
        hasMeBadge: boardText.includes('Bạn'),
        scrollWidth: document.body.scrollWidth,
      };
    });
    record(
      'E2E-6: GamesHubView restored 1.650 record & displays Live Arcade Leaderboard',
      gamesCheckB.hasTotalRecord &&
        gamesCheckB.hasPlayerOnBoard &&
        gamesCheckB.hasMeBadge &&
        gamesCheckB.scrollWidth <= 391,
      JSON.stringify(gamesCheckB)
    );

    // Scroll to Leaderboard & capture screenshot
    await pageB.evaluate(() => {
      const el = document.querySelector('[data-testid="arcade-leaderboard-section"]');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await sleep(400);
    await pageB.screenshot({
      path: path.join(ARTIFACT_DIR, 'cloud_03_games_leaderboard.png'),
    });

    // =========================================================================
    // DEVICE C: Independent Stranger sees "Cloud DB" word + Manual Restore test
    // =========================================================================
    const ctxC = await browser.createBrowserContext();
    const pageC = await ctxC.newPage();
    await pageC.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    pageC.on('pageerror', (e) => pageErrors.push('C: ' + e.toString()));

    await pageC.goto(`${BASE_URL}/#library`, { waitUntil: 'networkidle0' });
    await sleep(1500);

    // Open AddWordModal on Device C (independent user!)
    await pageC.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find((b) => b.textContent && b.textContent.includes('Thêm từ'));
      if (addBtn) addBtn.click();
    });
    await sleep(1200);

    await setReactInput(pageC, 'input[placeholder*="Tìm theo chữ Hán"]', '云端数据库');
    await sleep(500);

    const communityCheckC = await pageC.evaluate(() => {
      const text = document.body.innerText;
      return {
        foundHanzi: text.includes('云端数据库'),
        foundMeaning: text.includes('Cơ sở dữ liệu đám mây E2E'),
        foundCloudBadge: text.includes('Cloud DB'),
      };
    });
    record(
      'E2E-7: Independent Device C receives community word with "Cloud DB" badge',
      communityCheckC.foundHanzi &&
        communityCheckC.foundMeaning &&
        communityCheckC.foundCloudBadge,
      JSON.stringify(communityCheckC)
    );

    await pageC.screenshot({
      path: path.join(ARTIFACT_DIR, 'cloud_04_community_cloud_db.png'),
    });

    // Close AddWordModal on Device C & test Manual Restore Tab (dashless code)
    await pageC.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Đóng"]');
      if (closeBtn) closeBtn.click();
    });
    await sleep(400);

    await pageC.click('[data-testid="header-cloud-sync-btn"]');
    await sleep(500);
    await pageC.click('[data-testid="cloud-tab-restore"]');
    await sleep(300);

    const dashlessCode = syncCodeA.replace(/-/g, '');
    await pageC.click('[data-testid="restore-code-input"]');
    await pageC.type('[data-testid="restore-code-input"]', dashlessCode);
    await sleep(200);
    await pageC.click('[data-testid="restore-submit-btn"]');
    await sleep(2500);

    const manualRestoreC = await pageC.evaluate(() => {
      const banner = document.querySelector('[data-testid="cloud-feedback-banner"]');
      const input = document.querySelector('[data-testid="restore-code-input"]');
      return {
        bannerText: banner ? banner.textContent.trim() : '',
        inputValue: input ? input.value : null,
        storedCode: window.localStorage.getItem('hanziflow_sync_code'),
      };
    });
    console.log('manualRestoreC result:', manualRestoreC);
    record(
      'E2E-8: Manual dashless Sync ID restore succeeds in CloudSyncModal',
      manualRestoreC.storedCode === syncCodeA &&
        manualRestoreC.bannerText.includes('Khôi phục thành công'),
      JSON.stringify(manualRestoreC)
    );

    record('E2E-9: Zero uncaught page exceptions across 3 devices', pageErrors.length === 0, pageErrors.join('; '));

    console.log(`\nTEST_SYNC_CODE_FOR_CLEANUP=${syncCodeA}`);
    const failed = results.filter((r) => !r.pass);
    console.log(`\n=== E2E SUMMARY: ${results.length - failed.length}/${results.length} PASSED ===`);
    if (browser) await browser.close().catch(() => {});
    if (server) server.close();
    process.exit(failed.length > 0 ? 1 : 0);
  } finally {
    if (browser) await browser.close().catch(() => {});
    if (server) server.close();
  }
}

runCloudE2E().catch((err) => {
  console.error('Fatal E2E error:', err);
  process.exit(1);
});
