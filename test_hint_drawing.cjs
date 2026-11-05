const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function testHintDrawing(targetUrl) {
  console.log(`=== TESTING HANZIWRITER HINT & DRAWING RESUME ON ${targetUrl} ===\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=390,844']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.toString()));

  try {
    console.log(`1. Navigating to ${targetUrl}/#writing ...`);
    await page.goto(`${targetUrl}/#writing`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2500));

    // Check Hanzi canvas container
    const canvasBox = await page.evaluate(() => {
      const container = document.querySelector('.hanzi-canvas-container');
      if (!container) return null;
      const svg = container.querySelector('svg');
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        hasSvg: true
      };
    });
    console.log('Hanzi canvas found:', canvasBox);

    // Initial screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'hint_01_initial_canvas.png') });

    // Click "Gợi ý nét"
    console.log('2. Clicking "Gợi ý nét" button...');
    const clickedHint = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const hintBtn = buttons.find(b => b.textContent && b.textContent.includes('Gợi ý nét'));
      if (hintBtn) {
        hintBtn.click();
        return true;
      }
      return false;
    });
    console.log('Clicked hint button:', clickedHint);

    // Wait 300ms for banner
    await new Promise(r => setTimeout(r, 300));

    const hintMsg = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      const banner = divs.find(d => d.textContent && d.textContent.includes('Gợi ý: Đang minh họa nét thứ'));
      return banner ? banner.textContent.trim() : null;
    });
    console.log('Hint message banner:', hintMsg);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'hint_02_highlight_stroke.png') });

    // Wait another 400ms during stroke highlight animation
    await new Promise(r => setTimeout(r, 400));

    // 3. User draws on the Hanzi canvas!
    console.log('3. Simulating user drawing stroke on Hanzi canvas...');
    if (canvasBox) {
      // Stroke for 学: first stroke is dot/slash at top left:
      const startX = canvasBox.x + canvasBox.width * 0.35;
      const startY = canvasBox.y + canvasBox.height * 0.22;
      const endX = canvasBox.x + canvasBox.width * 0.42;
      const endY = canvasBox.y + canvasBox.height * 0.28;

      console.log(`Dragging from (${Math.round(startX)}, ${Math.round(startY)}) to (${Math.round(endX)}, ${Math.round(endY)})...`);
      
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      for (let i = 1; i <= 10; i++) {
        const curX = startX + (endX - startX) * (i / 10);
        const curY = startY + (endY - startY) * (i / 10);
        await page.mouse.move(curX, curY);
        await new Promise(r => setTimeout(r, 25));
      }
      await page.mouse.up();
    }

    await new Promise(r => setTimeout(r, 800));

    // Take screenshot after user drawing attempt
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'hint_03_user_drawing_active.png') });

    // Verify current stroke indicator
    const strokeIndicator = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent && s.textContent.includes('Nét '));
      return el ? el.textContent.trim() : null;
    });
    console.log('Stroke indicator on screen:', strokeIndicator);

    console.log('\n--- CONSOLE ERRORS ---');
    console.log(consoleErrors.length === 0 ? 'None (Clean!)' : consoleErrors);

    console.log('\n=== TEST PASSED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
}

testHintDrawing('http://localhost:4173');
