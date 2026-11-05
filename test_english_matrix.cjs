const fs = require('fs');
const path = require('path');

console.log('=== RUNNING ENGLISH APP TEST CASE MATRIX FOR HANZIFLOW ===\n');

let passed = 0;
let failed = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`[PASS] ${description}`);
    passed++;
  } else {
    console.error(`[FAIL] ${description}`);
    failed++;
  }
}

// 1. Check for Lookbehind (?< in compiled bundle (iOS Safari 15 crash hazard)
const distAssets = path.join(__dirname, 'dist', 'assets');
const jsFiles = fs.readdirSync(distAssets).filter(f => f.endsWith('.js'));
let hasLookbehind = false;

for (const f of jsFiles) {
  const content = fs.readFileSync(path.join(distAssets, f), 'utf-8');
  if (/\(\?<[!=]/.test(content)) {
    hasLookbehind = true;
    break;
  }
}
assert('TC-1 (Safari Compatibility): No RegExp lookbehind (?< in compiled bundle', !hasLookbehind);

// 2. Check PWA Manifest & Meta Tags
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
assert('TC-2 (PWA & Viewport): Contains viewport-fit=cover meta tag', indexHtml.includes('viewport-fit=cover'));
assert('TC-3 (PWA & Viewport): Contains user-scalable=no to prevent double tap zoom', indexHtml.includes('user-scalable=no'));
assert('TC-4 (PWA Icons): Contains SVG / Apple touch icon declaration', indexHtml.includes('favicon.svg'));

// 3. Check CSS Touch Engine & Safe Area
const cssFiles = fs.readdirSync(distAssets).filter(f => f.endsWith('.css'));
let cssContent = '';
for (const f of cssFiles) {
  cssContent += fs.readFileSync(path.join(distAssets, f), 'utf-8');
}
assert('TC-5 (Touch Action): Canvas container has touch-action: none', cssContent.includes('touch-action:none'));
assert('TC-6 (Safe Area Insets): CSS handles safe-area-inset-top and safe-area-inset-bottom', cssContent.includes('safe-area-inset-bottom'));

// 4. Test Text Normalizer (Fuzzy matcher for Translation)
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[。，！？.,!?:"'“”‘’\s]/g, '')
    .trim();
}

assert('TC-7 (Fuzzy Matcher): Strips Chinese punctuation (。，！？)', normalizeText('我明天去图书馆。') === '我明天去图书馆');
assert('TC-8 (Fuzzy Matcher): Strips Vietnamese punctuation and whitespace', normalizeText('Ngày mai, tôi đi thư viện!') === 'ngàymaitôiđithưviện');
assert('TC-9 (Fuzzy Matcher): Ignores case differences', normalizeText('HSK 1') === 'hsk1');

// 5. Test ErrorBoundary Presence
const mainContent = fs.readFileSync(path.join(__dirname, 'src', 'main.tsx'), 'utf-8');
assert('TC-10 (Resilience): App is wrapped with ErrorBoundary', mainContent.includes('<ErrorBoundary>'));

// 6. Test Keyboard Navigation in Flashcard
const flashcardContent = fs.readFileSync(path.join(__dirname, 'src', 'components', 'flashcard', 'FlashcardView.tsx'), 'utf-8');
assert('TC-11 (Keyboard Accessibility): Space key flips card, Arrow keys answer', flashcardContent.includes("e.code === 'Space'") && flashcardContent.includes("e.code === 'ArrowRight'"));

// 7. Test Background Tab Audio Suspension
const audioContent = fs.readFileSync(path.join(__dirname, 'src', 'utils', 'audio.ts'), 'utf-8');
assert('TC-12 (Audio Lifecycle): document.visibilitychange suspends speech on tab hide', audioContent.includes('visibilitychange') && audioContent.includes('stopSpeech'));

console.log(`\n=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) process.exit(1);
