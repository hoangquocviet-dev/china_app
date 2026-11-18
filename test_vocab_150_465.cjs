const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function testVocab150and465(targetUrl) {
  console.log(`=== TESTING 150 HSK1 WORDS & 465 DICTIONARY WORDS ON ${targetUrl} ===\n`);

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
    await new Promise(r => setTimeout(r, 1200));

    // Clear localStorage to ensure fresh default merge of 150 words
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Check Flashcard initial screen
    console.log('2. Checking Flashcard home screen...');
    const flashcardStats = await page.evaluate(() => {
      const allText = document.body.innerText;
      const countMatch = allText.match(/(\d+)\s*\/\s*(\d+)/);
      return {
        deckCount: countMatch ? countMatch[0] : null
      };
    });
    console.log('Flashcard stats:', flashcardStats);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_150_01_flashcard.png') });

    // 2. Navigate to "Từ vựng" tab
    console.log('3. Navigating to "Từ vựng" tab via button[data-tab="library"]...');
    await page.evaluate(() => {
      const libTab = document.querySelector('button[data-tab="library"]');
      if (libTab) libTab.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Check words count badge & dictionary button text
    const vocabStats = await page.evaluate(() => {
      const allText = document.body.innerText;
      const soTuMatch = allText.match(/Sổ từ:\s*(\d+)\s*từ/i);
      const dictBtnMatch = allText.match(/Từ điển\s*\((\d+)\+\)/i);
      const hanziBadges = document.querySelectorAll('.hanzi-badge');
      return {
        soTuCount: soTuMatch ? parseInt(soTuMatch[1]) : 0,
        dictCount: dictBtnMatch ? parseInt(dictBtnMatch[1]) : 0,
        hanziBadgesRendered: hanziBadges.length
      };
    });
    console.log('WordListView stats:', vocabStats);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_150_02_word_list.png') });

    // 3. Search for new HSK1 words in WordListView
    console.log('4. Searching for newly added HSK1 word "xiawu" (下午)...');
    const searchInput = await page.$('input[placeholder*="Tìm trong sổ từ"]');
    if (searchInput) {
      await searchInput.click();
      await searchInput.type('xiawu', { delay: 30 });
      await new Promise(r => setTimeout(r, 600));

      const xiawuFound = await page.evaluate(() => {
        const badges = Array.from(document.querySelectorAll('.hanzi-badge')).map(b => b.textContent.trim());
        return badges.includes('下午');
      });
      console.log('Found "下午" (xiawu) in WordListView:', xiawuFound);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_150_03_search_xiawu.png') });

      // Search for "gaoxing" (高兴)
      await page.evaluate(() => {
        const inp = document.querySelector('input[placeholder*="Tìm trong sổ từ"]');
        if (inp) {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await new Promise(r => setTimeout(r, 300));
      await searchInput.type('gaoxing', { delay: 30 });
      await new Promise(r => setTimeout(r, 600));

      const gaoxingFound = await page.evaluate(() => {
        const badges = Array.from(document.querySelectorAll('.hanzi-badge')).map(b => b.textContent.trim());
        return badges.includes('高兴');
      });
      console.log('Found "高兴" (gaoxing) in WordListView:', gaoxingFound);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_150_04_search_gaoxing.png') });

      // Clear search
      await page.evaluate(() => {
        const inp = document.querySelector('input[placeholder*="Tìm trong sổ từ"]');
        if (inp) {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await new Promise(r => setTimeout(r, 400));
    }

    // 4. Open Dictionary Modal
    console.log('5. Opening Dictionary modal...');
    await page.evaluate(() => {
      const dictBtn = Array.from(document.querySelectorAll('button')).find(
        b => b.textContent && b.textContent.includes('Từ điển')
      );
      if (dictBtn) dictBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Check Dictionary search for newly added culinary/everyday words
    const dictSearchInput = await page.$('.fixed.inset-0 input');
    if (dictSearchInput) {
      console.log('6. Searching "haochi" (好吃) in Dictionary modal...');
      await dictSearchInput.click();
      await dictSearchInput.type('haochi', { delay: 30 });
      await new Promise(r => setTimeout(r, 600));
      const haochiFound = await page.evaluate(() => {
        return document.querySelector('.fixed.inset-0').innerText.includes('好吃');
      });
      console.log('Found "好吃" (haochi) in Dictionary:', haochiFound);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_465_05_dict_haochi.png') });

      console.log('7. Searching "doufu" (豆腐) in Dictionary modal...');
      await page.evaluate(() => {
        const inp = document.querySelector('.fixed.inset-0 input');
        if (inp) {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await new Promise(r => setTimeout(r, 300));
      await dictSearchInput.type('doufu', { delay: 30 });
      await new Promise(r => setTimeout(r, 600));
      const doufuFound = await page.evaluate(() => {
        return document.querySelector('.fixed.inset-0').innerText.includes('豆腐');
      });
      console.log('Found "豆腐" (doufu) in Dictionary:', doufuFound);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_465_06_dict_doufu.png') });

      console.log('8. Searching "yuebing" (月饼) in Dictionary modal...');
      await page.evaluate(() => {
        const inp = document.querySelector('.fixed.inset-0 input');
        if (inp) {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await new Promise(r => setTimeout(r, 300));
      await dictSearchInput.type('yuebing', { delay: 30 });
      await new Promise(r => setTimeout(r, 600));
      const yuebingFound = await page.evaluate(() => {
        return document.querySelector('.fixed.inset-0').innerText.includes('月饼');
      });
      console.log('Found "月饼" (yuebing) in Dictionary:', yuebingFound);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vocab_465_07_dict_yuebing.png') });
    }

    console.log('\n--- CONSOLE ERRORS ---');
    console.log(consoleErrors.length === 0 ? 'None (Clean!)' : consoleErrors);

    if (vocabStats.soTuCount === 150 && vocabStats.dictCount === 465) {
      console.log('\n>>> SUCCESS 100%: 150/150 HSK1 words in notebook & 465+ words in Dictionary verified! <<<');
    } else {
      console.log(`\nStats check: Sổ từ=${vocabStats.soTuCount}, Từ điển=${vocabStats.dictCount}`);
    }

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
}

testVocab150and465(process.argv[2] || 'https://chinaapp.vercel.app');
