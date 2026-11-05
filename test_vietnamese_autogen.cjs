const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\8b1ba9a7-0900-4573-8a79-30d47902b911';

async function testVietnameseAutoGen(targetUrl) {
  console.log(`=== TESTING VIETNAMESE AUTO-GENERATE FEATURE ON ${targetUrl} ===\n`);

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
    // 1. Navigate to App Home
    console.log('1. Loading app...');
    await page.goto(`${targetUrl}/#flashcard`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // 2. Open Custom Lesson Modal
    console.log('2. Opening Custom Lesson Modal...');
    await page.click('button[data-testid="header-custom-lesson-btn"]');
    await new Promise(r => setTimeout(r, 600));

    // 3. Open Add Word collapsible
    console.log('3. Opening Add Word form...');
    await page.click('button[data-testid="toggle-add-word-btn"]');
    await page.waitForSelector('input[data-testid="vietnamese-word-input"]', { timeout: 3000 });

    // Screenshot: Auto-generate mode UI
    const ss1 = path.join(ARTIFACT_DIR, 'autogen_01_vietnamese_input_mode.png');
    await page.screenshot({ path: ss1 });
    console.log(`   Captured: ${ss1}`);

    // 4. Type Vietnamese word "bác sĩ" and click "Tự tạo & Thêm"
    console.log('4. Entering Vietnamese word "bác sĩ" (doctor)...');
    await page.type('input[data-testid="vietnamese-word-input"]', 'bác sĩ');
    await new Promise(r => setTimeout(r, 300));

    console.log('   Clicking "Tự tạo & Thêm"...');
    await page.click('button[data-testid="auto-generate-btn"]');
    await new Promise(r => setTimeout(r, 1500));

    // Verify word "医生" is present in the list
    const hasDoctorWord = await page.evaluate(() => {
      const hanziList = Array.from(document.querySelectorAll('span')).map(s => s.textContent?.trim());
      return hanziList.includes('医生');
    });
    console.log(`   Word "医生" auto-generated and added: ${hasDoctorWord ? 'PASS' : 'FAIL'}`);

    // Screenshot: Doctor word in list
    const ss2 = path.join(ARTIFACT_DIR, 'autogen_02_doctor_word_added.png');
    await page.screenshot({ path: ss2 });
    console.log(`   Captured: ${ss2}`);

    // 5. Test another word in Luyện viết tab: "trà"
    console.log('\n5. Testing in Luyện viết tab with word "trà" (tea)...');
    await page.click('button[data-testid="modal-tab-writing"]');
    await new Promise(r => setTimeout(r, 600));

    const isInputVisible = await page.$('input[data-testid="vietnamese-word-input"]');
    if (!isInputVisible) {
      await page.click('button[data-testid="toggle-add-word-btn"]');
      await page.waitForSelector('input[data-testid="vietnamese-word-input"]', { timeout: 3000 });
    }

    await page.type('input[data-testid="vietnamese-word-input"]', 'trà');
    await new Promise(r => setTimeout(r, 300));

    await page.click('button[data-testid="auto-generate-btn"]');
    await new Promise(r => setTimeout(r, 1500));

    const hasTeaWord = await page.evaluate(() => {
      const hanziList = Array.from(document.querySelectorAll('span')).map(s => s.textContent?.trim());
      return hanziList.includes('茶');
    });
    console.log(`   Word "茶" auto-generated and added: ${hasTeaWord ? 'PASS' : 'FAIL'}`);

    // Screenshot: Tea word in list
    const ss3 = path.join(ARTIFACT_DIR, 'autogen_03_tea_word_added.png');
    await page.screenshot({ path: ss3 });
    console.log(`   Captured: ${ss3}`);

    // 6. Close Modal with "Hoàn tất & Áp dụng"
    console.log('\n6. Applying changes and closing modal...');
    await page.evaluate(() => {
      const applyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Hoàn tất & Áp dụng'));
      if (applyBtn) applyBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    console.log('\n=== TEST SUMMARY ===');
    console.log(`Console Errors: ${consoleErrors.length}`);

    const isSuccess = hasDoctorWord && hasTeaWord && consoleErrors.length === 0;
    return { success: isSuccess };
  } finally {
    await browser.close();
  }
}

const url = process.argv[2] || 'http://localhost:4173';
testVietnameseAutoGen(url)
  .then(res => {
    console.log('\nFinal Auto-Gen Test Result:', res);
    process.exit(res.success ? 0 : 1);
  })
  .catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
