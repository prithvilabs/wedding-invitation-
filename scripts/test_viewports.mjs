import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const viewports = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'tablet-1024x768', width: 1024, height: 768 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-375x812', width: 375, height: 812 }
];

async function run() {
  const browser = await chromium.launch({ channel: 'msedge' }).catch(() => chromium.launch({ channel: 'chrome' }));
  const outDir = path.resolve('tests/screenshots');
  fs.mkdirSync(outDir, { recursive: true });

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:4173/wedding-invitation-/', { waitUntil: 'domcontentloaded' });
    
    const seal = page.locator('.wax-seal-target, [aria-label*="wax seal"]');
    if (await seal.count() > 0) {
      try {
        await seal.first().click({ force: true });
        await page.waitForTimeout(5500);
      } catch (e) {
        console.error('Error clicking seal:', e);
      }
    }
    
    // Wait for hero to be visible
    await page.waitForSelector('#hero, .hero-stage', { state: 'visible', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);
    
    // Check horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const hasHorizontalOverflow = scrollWidth > clientWidth;

    console.log(`[${vp.name}] Viewport: ${vp.width}x${vp.height}, scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}, overflow: ${hasHorizontalOverflow}`);

    // Scroll to story section stop 2
    const storyStop = page.locator('.story-insta-card-wrap');
    if (await storyStop.count() > 0) {
      await storyStop.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      const storyScreenshotPath = path.join(outDir, `${vp.name}-story.png`);
      await page.screenshot({ path: storyScreenshotPath });
    }

    const screenshotPath = path.join(outDir, `${vp.name}.png`);
    await page.screenshot({ path: screenshotPath });
    await page.close();
  }

  await browser.close();
  console.log('All viewport checks completed successfully.');
}

run().catch(console.error);
