const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const pages = [
  { file: 'index.html', out: 'social-preview.png' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const p of pages) {
    if (!fs.existsSync(p.file)) continue;
    await page.goto('file://' + path.resolve(p.file));

    // wait until the typing animation has really finished (the endless cursor blink is ignored)
    await page.evaluate(() => Promise.all(
      document.getAnimations()
        .filter((a) => a.effect && a.effect.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished)
    )).catch(() => {});

    // keep the cursor visible in the screenshot, then a small pause to settle
    await page.addStyleTag({ content: '.cursor { opacity: 1 !important; }' });
    await page.waitForTimeout(400);

    await page.screenshot({ path: p.out });
  }
  await browser.close();
})();
