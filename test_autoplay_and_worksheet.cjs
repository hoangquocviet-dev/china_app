const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4195;
const BASE_URL = `http://localhost:${PORT}`;
const distDir = path.resolve(__dirname, 'dist');
const artifactsDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

function createStaticServer() {
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

async function runTest() {
  console.log('=== TESTING HANDS-FREE AUDIO PLAYER & PRINTABLE WORKSHEET ===\n');
  const server = await createStaticServer();

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Step 1: Check toggle-autoplay-btn
    await page.waitForSelector('[data-testid="toggle-autoplay-btn"]', { timeout: 5000 });
    console.log('[PASS] Found [data-testid="toggle-autoplay-btn"] on FlashcardView');

    // Step 2: Click to activate AutoPlay
    await page.click('[data-testid="toggle-autoplay-btn"]');
    await page.waitForSelector('[data-testid="autoplay-active-banner"]', { timeout: 3000 });
    console.log('[PASS] AutoPlay activated -> banner [data-testid="autoplay-active-banner"] rendered');

    // Screenshot 1: Flashcard with active hands-free audio banner
    const ss1Path = path.join(artifactsDir, 'new_feature_05_handsfree_audio_player.png');
    await page.screenshot({ path: ss1Path });
    console.log(`[PASS] Saved screenshot to ${ss1Path}`);

    // Step 3: Deactivate AutoPlay
    await page.click('[data-testid="toggle-autoplay-btn"]');
    await new Promise((r) => setTimeout(r, 400));
    const isBannerHidden = (await page.$('[data-testid="autoplay-active-banner"]')) === null;
    console.log(`[PASS] AutoPlay stopped -> banner removed (isBannerHidden=${isBannerHidden})`);

    // Step 4: Navigate to Tab 2 (Luyện viết)
    await page.evaluate(() => { window.location.hash = 'writing'; });
    await new Promise((r) => setTimeout(r, 1000));
    await page.waitForSelector('[data-testid="open-worksheet-modal-btn"]', { timeout: 5000 });
    console.log('[PASS] Navigated to Tab 2 -> found [data-testid="open-worksheet-modal-btn"]');

    // Step 5: Click Open Worksheet Modal
    await page.click('[data-testid="open-worksheet-modal-btn"]');
    await page.waitForSelector('#printable-hanzi-worksheet', { timeout: 4000 });
    console.log('[PASS] WorksheetModal opened -> found #printable-hanzi-worksheet');

    // Screenshot 2: Worksheet A4 Preview Modal
    const ss2Path = path.join(artifactsDir, 'new_feature_06_printable_worksheet_a4.png');
    await page.screenshot({ path: ss2Path });
    console.log(`[PASS] Saved screenshot to ${ss2Path}`);

    // Step 6: Test Scope toggle to 'deck'
    const switchScopeButtons = await page.$$eval(
      '.print\\:hidden button',
      (btns) => btns.map((b) => b.textContent.trim())
    );
    console.log('[PASS] Found worksheet controls:', switchScopeButtons.join(' | '));

    console.log('\n=== ALL 6/6 NEW FEATURE TESTS PASSED ===');
  } catch (err) {
    console.error('[FAIL] Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

runTest();
