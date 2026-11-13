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
    await page.addStyleTag({ content: '.cursor { animation: none !important; }' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: p.out });
  }
  await browser.close();
})();
