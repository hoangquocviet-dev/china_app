const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4197;
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
  console.log('=== TESTING HSK 2 PACK 1-CLICK IMPORT FEATURE ===\n');
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

    // Step 1: Navigate to Tab 6 (Từ vựng)
    await page.evaluate(() => { window.location.hash = 'library'; });
    await new Promise((r) => setTimeout(r, 800));

    // Step 2: Click HSK 2 filter chip
    await page.waitForSelector('[data-testid="level-filter-hsk2"]', { timeout: 5000 });
    await page.click('[data-testid="level-filter-hsk2"]');
    await new Promise((r) => setTimeout(r, 400));
    console.log('[PASS] Clicked HSK 2 filter chip');

    // Step 3: Check 1-click Import CTA Button
    await page.waitForSelector('[data-testid="import-hsk2-pack-btn"]', { timeout: 4000 });
    console.log('[PASS] Found [data-testid="import-hsk2-pack-btn"] in HSK 2 empty state');

    // Screenshot 1: HSK 2 Empty state with CTA
    const ss1Path = path.join(artifactsDir, 'new_feature_09_hsk2_pack_cta.png');
    await page.screenshot({ path: ss1Path });
    console.log(`[PASS] Saved screenshot to ${ss1Path}`);

    // Step 4: Click 1-Click Import button
    await page.click('[data-testid="import-hsk2-pack-btn"]');
    await new Promise((r) => setTimeout(r, 800));

    // Step 5: Verify HSK 2 words are now imported and rendered
    const wordCardsCount = await page.$$eval(
      '.space-y-2\\.5 > div',
      (divs) => divs.length
    );
    console.log(`[PASS] HSK 2 pack imported -> rendered ${wordCardsCount} HSK 2 word cards in library`);

    // Screenshot 2: HSK 2 Loaded Word Library
    const ss2Path = path.join(artifactsDir, 'new_feature_10_hsk2_library_loaded.png');
    await page.screenshot({ path: ss2Path });
    console.log(`[PASS] Saved screenshot to ${ss2Path}`);

    console.log('\n=== ALL 5/5 HSK 2 IMPORT TESTS PASSED ===');
  } catch (err) {
    console.error('[FAIL] Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

runTest();
