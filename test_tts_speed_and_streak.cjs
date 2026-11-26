const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';
const PORT = 4195;
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

async function runFeatureTest() {
  console.log('=== VERIFYING TTS SPEED CONTROL & STREAK FREEZE SHIELD ===\n');

  const server = await createStaticServer();
  let browser;
  const results = [];
  const record = (name, passed, detail = '') => {
    results.push({ name, passed, detail });
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}${detail ? ' -> ' + detail : ''}`);
  };

  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    const errors = [];
    page.on('pageerror', (err) => errors.push(err.toString()));

    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await sleep(600);

    // 1. Check TTS Speed button in Header
    const initialSpeedText = await page.$eval('[data-testid="header-tts-speed-btn"]', el => el.textContent.trim());
    record('TTS Speed button rendered in Header', Boolean(initialSpeedText), `initial=${initialSpeedText}`);

    // Cycle speed: 1.0x -> 1.25x
    await page.click('[data-testid="header-tts-speed-btn"]');
    await sleep(200);
    const speed2 = await page.$eval('[data-testid="header-tts-speed-btn"]', el => el.textContent.trim());
    record('TTS Speed cycles to next rate', speed2 !== initialSpeedText, `next=${speed2}`);

    // 2. Check Streak Flame button in Header
    const streakBtnText = await page.$eval('[data-testid="header-streak-btn"]', el => el.textContent.trim());
    record('Streak Flame button rendered in Header', Boolean(streakBtnText), `streak=${streakBtnText}`);

    // 3. Open Streak & Freeze Shield Modal
    await page.click('[data-testid="header-streak-btn"]');
    await sleep(400);

    const modalCheck = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const title = document.querySelector('#streak-modal-title')?.textContent?.trim();
      const hasShield = document.body.textContent.includes('Khiên Bảo Vệ Chuỗi') && document.body.textContent.includes('Sẵn sàng');
      const hasWeek = document.body.textContent.includes('Tuần này') && document.body.textContent.includes('T2');
      return {
        hasModal: Boolean(modal),
        title,
        hasShield,
        hasWeek,
      };
    });

    record(
      'StreakModal displays streak counter, freeze shield and weekly tracker',
      modalCheck.hasModal && modalCheck.hasShield && modalCheck.hasWeek,
      `title="${modalCheck.title}", hasShield=${modalCheck.hasShield}, hasWeek=${modalCheck.hasWeek}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'new_feature_01_streak_modal.png') });

    // 4. Close Modal with Escape key
    await page.keyboard.press('Escape');
    await sleep(300);
    const isClosed = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
    record('StreakModal dismisses cleanly on Escape', isClosed);

    // 5. Test Study Activity Recording on Flashcard Flip
    const streakBefore = await page.evaluate(() => {
      return window.localStorage.getItem('hanziflow_streak');
    });

    // Flip card
    await page.click('.perspective-1000');
    await sleep(300);

    const streakDataAfter = await page.evaluate(() => {
      return window.localStorage.getItem('hanziflow_streak_details');
    });
    record(
      'Flipping flashcard records study activity & initializes streak details',
      Boolean(streakDataAfter && streakDataAfter.includes('currentStreak')),
      `detailsLength=${streakDataAfter?.length}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'new_feature_02_header_speed_streak.png') });

    record('Zero uncaught exceptions during new feature flows', errors.length === 0, errors.join('; '));

    const failed = results.filter((r) => !r.passed);
    console.log(`\n=== FEATURE TEST SUMMARY: ${results.length - failed.length}/${results.length} PASSED ===`);
    if (browser) await browser.close().catch(() => {});
    if (server) server.close();
    process.exit(failed.length > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test error:', err);
    if (browser) await browser.close().catch(() => {});
    if (server) server.close();
    process.exit(1);
  }
}

runFeatureTest();
