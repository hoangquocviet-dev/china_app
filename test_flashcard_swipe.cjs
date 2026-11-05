const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function testFlashcardSwipe(targetUrl) {
  console.log(`=== TESTING FLASHCARD SWIPE UP TO FLIP ON ${targetUrl} ===\n`);

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
    console.log(`1. Navigating to ${targetUrl} ...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    // Ensure we are on flashcard tab
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('nav button, header button'));
      const fcTab = tabs.find(b => b.textContent && b.textContent.includes('Flashcard'));
      if (fcTab) fcTab.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 1. Verify text "Vuốt lên để lật"
    console.log('2. Checking "Vuốt lên để lật" hint text in UI...');
    const hintCheck = await page.evaluate(() => {
      const fullText = document.body.innerText;
      return {
        hasVuotLenDeLat: fullText.includes('Vuốt lên để lật'),
        hasChamVaoDeLat: fullText.includes('Chạm vào để lật') || fullText.includes('Chạm vào thẻ để xem nghĩa')
      };
    });
    console.log('UI text check:', hintCheck);

    // Initial screenshot (Front of card)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'flashcard_01_front_with_swipe_hint.png') });

    // 2. Perform Touch Swipe Up gesture on the card
    console.log('3. Performing Touch Swipe Up on flashcard container...');
    const cardRect = await page.evaluate(() => {
      const card = document.querySelector('.perspective-1000');
      if (!card) return null;
      const rect = card.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });

    if (cardRect) {
      const client = await page.target().createCDPSession();
      const centerX = cardRect.x + cardRect.width / 2;
      const startY = cardRect.y + cardRect.height * 0.7;
      const endY = cardRect.y + cardRect.height * 0.25;

      console.log(`Simulating touch swipe from (${Math.round(centerX)}, ${Math.round(startY)}) up to (${Math.round(centerX)}, ${Math.round(endY)})...`);

      // Touch start
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: centerX, y: startY, id: 0 }]
      });
      await new Promise(r => setTimeout(r, 40));

      // Touch move
      for (let i = 1; i <= 8; i++) {
        const curY = startY + (endY - startY) * (i / 8);
        await client.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: centerX, y: curY, id: 0 }]
        });
        await new Promise(r => setTimeout(r, 25));
      }

      // Touch end
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: []
      });
    }

    // Wait 600ms for 3D flip animation
    await new Promise(r => setTimeout(r, 700));

    // Check if card is flipped to back side
    const backSideCheck = await page.evaluate(() => {
      const card3D = document.querySelector('.transform-style-3d');
      const isFlippedClass = card3D ? card3D.className.includes('rotate-x-180') : false;
      const hasMeaning = document.body.innerText.includes('Âm Hán Việt') || document.body.innerText.includes('Câu ví dụ');
      return { isFlippedClass, hasMeaning };
    });
    console.log('Back side check after swipe up:', backSideCheck);

    // Screenshot of Back of Card
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'flashcard_02_back_flipped.png') });

    // 3. Test tap to flip back
    console.log('4. Performing Tap to flip back to front...');
    if (cardRect) {
      const client = await page.target().createCDPSession();
      const centerX = cardRect.x + cardRect.width / 2;
      const centerY = cardRect.y + cardRect.height / 2;

      await client.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: centerX, y: centerY, id: 0 }]
      });
      await new Promise(r => setTimeout(r, 50));
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: []
      });
    }

    await new Promise(r => setTimeout(r, 700));

    const frontAgainCheck = await page.evaluate(() => {
      const card3D = document.querySelector('.transform-style-3d');
      const isFlippedClass = card3D ? card3D.className.includes('rotate-x-180') : false;
      return { isFront: !isFlippedClass };
    });
    console.log('Card returned to front side:', frontAgainCheck);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'flashcard_03_front_again.png') });

    console.log('\n--- CONSOLE ERRORS ---');
    console.log(consoleErrors.length === 0 ? 'None (Clean!)' : consoleErrors);

    console.log('\n=== TEST COMPLETED ===');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
}

testFlashcardSwipe(process.argv[2] || 'http://localhost:4173');
