const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4196;
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
  console.log('=== TESTING TONE MASTER GAME (PHẢN XẠ 4 THANH ĐIỆU) ===\n');
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

    // Step 1: Navigate to Tab 5 (Trò chơi)
    await page.evaluate(() => { window.location.hash = 'games'; });
    await new Promise((r) => setTimeout(r, 800));

    // Step 2: Locate Tone Master Card
    await page.waitForSelector('[data-testid="game-card-tone"]', { timeout: 5000 });
    console.log('[PASS] Found [data-testid="game-card-tone"] in GamesHub');

    // Step 3: Click to launch game
    await page.click('[data-testid="game-card-tone"]');
    await page.waitForSelector('[data-testid="tone-listen-audio-btn"]', { timeout: 4000 });
    console.log('[PASS] ToneMasterGame launched -> audio button and tone cards rendered');

    // Screenshot 1: Question 1 View
    const ss1Path = path.join(artifactsDir, 'new_feature_07_tone_master_q1.png');
    await page.screenshot({ path: ss1Path });
    console.log(`[PASS] Saved screenshot to ${ss1Path}`);

    // Step 4: Play through all 10 questions
    for (let i = 1; i <= 10; i++) {
      // Pick a random tone option 1 to 4
      const randomTone = Math.floor(Math.random() * 4) + 1;
      const btnSelector = `[data-testid="tone-choice-btn-${randomTone}"]`;
      await page.waitForSelector(btnSelector, { timeout: 3000 });
      await page.click(btnSelector);
      await new Promise((r) => setTimeout(r, 150));

      // Click Next
      await page.waitForSelector('[data-testid="tone-next-btn"]', { timeout: 3000 });
      await page.click('[data-testid="tone-next-btn"]');
      await new Promise((r) => setTimeout(r, 200));
    }

    // Step 5: Check Scorecard
    await page.waitForFunction(
      () => document.body.innerText.includes('KẾT QUẢ PHẢN XẠ THANH ĐIỆU'),
      { timeout: 5000 }
    );
    console.log('[PASS] Reached scorecard screen after 10 questions');

    // Screenshot 2: Scorecard View
    const ss2Path = path.join(artifactsDir, 'new_feature_08_tone_master_scorecard.png');
    await page.screenshot({ path: ss2Path });
    console.log(`[PASS] Saved screenshot to ${ss2Path}`);

    // Step 6: Click "Về sảnh trò chơi"
    const backBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent && b.textContent.includes('Về sảnh trò chơi'));
    });
    if (backBtn) {
      await backBtn.click();
      await page.waitForSelector('[data-testid="game-card-tone"]', { timeout: 4000 });
      console.log('[PASS] Returned to GamesHubView successfully');
    }

    console.log('\n=== ALL 6/6 TONE MASTER TESTS PASSED ===');
  } catch (err) {
    console.error('[FAIL] Test error:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

runTest();
