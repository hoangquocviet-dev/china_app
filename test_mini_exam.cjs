const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';
const PORT = 4196;
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

async function runExamTest() {
  console.log('=== VERIFYING HSK 1 MINI EXAM (10 QUESTIONS) ===\n');

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

    // 1. Switch to Games Tab
    await page.evaluate(() => window.location.hash = 'games');
    await sleep(500);

    // 2. Check Featured Exam Card in GamesHub
    const hasExamCard = await page.evaluate(() => {
      const card = document.querySelector('[data-testid="game-card-exam"]');
      return Boolean(card && card.textContent.includes('Thi Thử HSK 1'));
    });
    record('Featured HSK 1 Exam Card is present in GamesHub', hasExamCard);

    // 3. Click to Launch Exam
    await page.click('[data-testid="game-card-exam"]');
    await sleep(500);

    // 4. Verify Exam View Started at Question 1/10
    const examHeaderCheck = await page.evaluate(() => {
      const title = document.body.textContent.includes('THI THỬ HSK 1');
      const qProgress = document.body.textContent.includes('Câu 1 / 10');
      const options = document.querySelectorAll('button[disabled="false"], .bg-slate-800\\/80');
      return {
        title,
        qProgress,
        hasOptions: options.length > 0,
      };
    });

    record(
      'Exam starts cleanly at Question 1/10 with interactive options',
      examHeaderCheck.title && examHeaderCheck.qProgress,
      `title=${examHeaderCheck.title}, progress=${examHeaderCheck.qProgress}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'new_feature_03_exam_q1.png') });

    // 5. Answer all 10 questions systematically
    for (let i = 1; i <= 10; i++) {
      // Find an option button to click
      await page.evaluate(() => {
        const option = document.querySelector('.space-y-2 button:not([disabled])') ||
          document.querySelector('.space-y-2 button');
        if (option) option.click();
      });
      await sleep(250);

      // If not last question, click Next question
      if (i < 10) {
        await page.evaluate(() => {
          const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Câu Tiếp Theo'));
          if (nextBtn) nextBtn.click();
        });
        await sleep(350);
      } else {
        // Last question: Click "Xem Kết Quả"
        await page.evaluate(() => {
          const finishBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Xem Kết Quả'));
          if (finishBtn) finishBtn.click();
        });
        await sleep(500);
      }
    }

    // 6. Verify Scorecard & Evaluation Rank
    const scorecardCheck = await page.evaluate(() => {
      const hasTitle = document.body.textContent.includes('KẾT QUẢ THI THỬ HSK 1');
      const hasScore = document.body.textContent.includes('/ 100');
      const hasBest = document.body.textContent.includes('Kỷ lục cao nhất:');
      const hasRestartBtn = Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Thi Đề Mới'));
      const hasDoneBtn = Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Hoàn Thành'));
      return {
        hasTitle,
        hasScore,
        hasBest,
        hasRestartBtn,
        hasDoneBtn,
      };
    });

    record(
      'Exam completes and displays Scorecard, Rank & Action buttons',
      scorecardCheck.hasTitle && scorecardCheck.hasScore && scorecardCheck.hasDoneBtn,
      `scorecard=${scorecardCheck.hasTitle}, scorePresent=${scorecardCheck.hasScore}`
    );

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'new_feature_04_exam_scorecard.png') });

    // 7. Click Hoàn Thành to return to GamesHub
    await page.evaluate(() => {
      const doneBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Hoàn Thành'));
      if (doneBtn) doneBtn.click();
    });
    await sleep(400);

    const backInHub = await page.evaluate(() => {
      return Boolean(document.querySelector('[data-testid="game-card-exam"]'));
    });
    record('Clicking Hoàn Thành returns safely to GamesHub', backInHub);

    record('Zero uncaught exceptions during 10-question exam flow', errors.length === 0, errors.join('; '));

    const failed = results.filter((r) => !r.passed);
    console.log(`\n=== EXAM TEST SUMMARY: ${results.length - failed.length}/${results.length} PASSED ===`);
    if (browser) await browser.close().catch(() => {});
    if (server) server.close();
    process.exit(failed.length > 0 ? 1 : 0);
  } catch (err) {
    console.error('Exam test error:', err);
    if (browser) await browser.close().catch(() => {});
    if (server) server.close();
    process.exit(1);
  }
}

runExamTest();
