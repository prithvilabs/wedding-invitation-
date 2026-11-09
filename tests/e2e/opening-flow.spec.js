import { test, expect } from '@playwright/test';

// Desktop project runs at 1440x900, mobile project at 390x844
const viewportFor = (project) => (project === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 });

/** Page time is controlled by the test so every beat is captured exactly. */
async function openPausedAtLoad(page) {
  await page.clock.install({ time: new Date('2027-01-01T08:00:00') });
  await page.clock.pauseAt(new Date('2027-01-01T08:00:01'));
  await page.goto('/'); // resolves on the load event, which starts the fade-up
}

test.describe('curtain opening', () => {
  test('waits closed with the PH medallion, opens on touch, reveals the homepage', async ({ page }, testInfo) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.setViewportSize(viewportFor(testInfo.project.name));
    await openPausedAtLoad(page);

    const curtains = page.getByTestId('curtain-opening');
    const medallion = page.getByRole('button', { name: 'Open the wedding invitation' });
    await expect(curtains).toBeAttached();
    // The homepage is already rendered behind the curtains from the start
    await expect(page.locator('#hero')).toBeAttached();

    const shot = async (name) => {
      const path = testInfo.outputPath(`${testInfo.project.name}-${name}.png`);
      await page.screenshot({ path, scale: 'css' });
      await testInfo.attach(name, { path, contentType: 'image/png' });
    };

    // Closed, waiting: medallion centred on the curtains; nothing opens by itself
    await page.clock.runFor(2000);
    await expect(medallion).toBeVisible();
    const box = await medallion.boundingBox();
    const vp = page.viewportSize();
    expect(Math.abs(box.x + box.width / 2 - vp.width / 2)).toBeLessThan(4);
    expect(Math.abs(box.y + box.height / 2 - vp.height / 2)).toBeLessThan(4);
    await shot('1-closed-medallion');

    await page.clock.runFor(8000);
    await expect(curtains).toBeAttached();
    await expect(curtains).not.toHaveClass(/is-opening/);
    await expect(curtains).toHaveCSS('pointer-events', 'auto');

    // Touch the medallion -> curtains part, clicks pass through to the homepage
    await medallion.click({ force: true });
    await page.clock.runFor(800);
    await expect(curtains).toHaveClass(/is-opening/);
    await expect(curtains).toHaveCSS('pointer-events', 'none');
    await shot('2-opening');

    // Curtains done ~2.75s after the touch: overlay removed
    await page.clock.runFor(2000);
    await expect(curtains).toHaveCount(0);
    await shot('3-curtain-end');

    // Camera push: the homepage content travels forward from slightly smaller...
    const mainScale = () =>
      page.evaluate(() => {
        const t = getComputedStyle(document.getElementById('mainWebsite')).transform;
        return t === 'none' ? 1 : new DOMMatrix(t).a;
      });
    await page.clock.runFor(600);
    const midScale = await mainScale();
    expect(midScale).toBeGreaterThan(0.92);
    expect(midScale).toBeLessThan(1);
    await shot('4-zoom-mid');

    // ...and settles at its natural size, with the transform fully cleared
    await page.clock.runFor(1200);
    await expect(page.locator('#mainWebsite')).toHaveCSS('transform', 'none');
    await page.clock.resume();
    await shot('5-final');

    // Homepage usable: no scroll lock, no horizontal overflow, scrolls normally
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole('heading', { level: 1, name: /Prithvi Raj weds Harshini/i })).toBeVisible();

    // Fixed music player back in its bottom-right corner
    const dock = await page.locator('.floating-music-dock').boundingBox();
    const vp2 = page.viewportSize();
    expect(vp2.width - (dock.x + dock.width)).toBeLessThan(40);
    expect(vp2.height - (dock.y + dock.height)).toBeLessThan(40);

    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    expect(errors).toEqual([]);
  });

  test('touching anywhere on the curtains opens them too', async ({ page }) => {
    await openPausedAtLoad(page);
    await page.clock.runFor(1500);
    await page.mouse.click(60, 300); // far from the medallion
    await page.clock.runFor(3200);
    await expect(page.getByTestId('curtain-opening')).toHaveCount(0);
  });

  test('music starts the moment the curtains are touched, and a later pause sticks', async ({ page }) => {
    // Record play()/pause() on the wedding song only (other media on the page are ignored)
    await page.addInitScript(() => {
      window.__audioLog = [];
      const isSong = (el) => /wedding-song/.test(el.currentSrc || el.src || '');
      const { play, pause } = HTMLMediaElement.prototype;
      HTMLMediaElement.prototype.play = function () {
        if (isSong(this)) window.__audioLog.push('play');
        return play.call(this).catch(() => {});
      };
      HTMLMediaElement.prototype.pause = function () {
        if (isSong(this)) window.__audioLog.push('pause');
        return pause.call(this);
      };
    });
    await page.goto('/');
    const log = () => page.evaluate(() => window.__audioLog);
    expect(await log()).not.toContain('play'); // nothing plays before the touch

    // Touch the PH medallion: music starts immediately, while the curtains open
    await page.getByRole('button', { name: 'Open the wedding invitation' }).click({ force: true });
    expect(await log()).toContain('play');
    await expect(page.getByTestId('curtain-opening')).toBeAttached();

    // After the reveal, pausing via the music player isn't overridden by a later click handler
    await expect(page.getByTestId('curtain-opening')).toHaveCount(0, { timeout: 6000 });
    const playsBefore = (await log()).filter((e) => e === 'play').length;
    await page.locator('#floatingMusicBtn').click();
    await page.locator('#hero').click({ position: { x: 20, y: 200 }, force: true });
    const after = await log();
    expect(after.filter((e) => e === 'play').length).toBe(playsBefore);
  });

  test('keyboard: Enter on the medallion opens the curtains', async ({ page }) => {
    await openPausedAtLoad(page);
    await page.clock.runFor(1500);
    await page.getByRole('button', { name: 'Open the wedding invitation' }).press('Enter');
    await page.clock.runFor(3200);
    await expect(page.getByTestId('curtain-opening')).toHaveCount(0);
  });

  test('existing homepage features still work after the curtains', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open the wedding invitation' }).click({ force: true });
    await expect(page.getByTestId('curtain-opening')).toHaveCount(0, { timeout: 5000 });

    await expect(page.getByRole('timer', { name: /Live countdown/i })).toBeAttached();
    for (const id of ['#countdown', '#families', '#story', '#events', '#rsvp']) {
      await expect(page.locator(id)).toBeAttached();
    }
    await expect(page.getByRole('complementary', { name: 'Music Control' })).toBeAttached();

    // RSVP form accepts input (not submitted)
    const name = page.getByRole('textbox', { name: /Full Name/i });
    await name.scrollIntoViewIfNeeded();
    await name.fill('Test Guest');
    await expect(name).toHaveValue('Test Guest');
  });

  test('once per visit: after opening, a reload goes straight to the homepage', async ({ page }) => {
    await page.goto('/');
    // Reloading before opening shows the curtains again
    await page.reload();
    const medallion = page.getByRole('button', { name: 'Open the wedding invitation' });
    await medallion.click({ force: true });
    await expect(page.getByTestId('curtain-opening')).toHaveCount(0, { timeout: 5000 });
    // Opened once -> not shown again this visit
    await page.reload();
    await expect(page.locator('#hero')).toBeAttached();
    await expect(page.getByTestId('curtain-opening')).toHaveCount(0);
  });

  test('reduced motion: no curtains, homepage shown immediately', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: viewportFor(testInfo.project.name) });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('#hero')).toBeAttached();
    await expect(page.getByTestId('curtain-opening')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1, name: /Prithvi Raj weds Harshini/i })).toBeVisible();
    await context.close();
  });
});
