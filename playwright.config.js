import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright setup for the visual/functional verification loop:
 * IMPLEMENTATION -> PLAYWRIGHT -> VISUAL + FUNCTIONAL VERIFICATION -> ITERATE.
 * Reuses an already-running `npm run dev` at baseURL, or starts one itself.
 *
 * Browser: Playwright's standard managed Chromium (`npx playwright install chromium`).
 * To use a pre-installed browser instead (e.g. the Linux sandbox's
 * /opt/pw-browsers/chromium), set PW_CHROMIUM_PATH. See docs/playwright-linux.md.
 */
const chromiumPath = process.env.PW_CHROMIUM_PATH;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // Keep parallel browsers modest so animation timings stay reliable on
  // integrated-GPU machines.
  workers: 2,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000/wedding-invitation-/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...(chromiumPath ? { launchOptions: { executablePath: chromiumPath } } : {})
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/wedding-invitation-/',
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      // Android Chrome: Chromium with Pixel 7 emulation (touch, mobile UA)
      name: 'mobile',
      use: { ...devices['Pixel 7'] }
    },
    {
      // iPhone Safari: WebKit with iPhone 13 emulation. Opening/music flow only.
      // Needs `npx playwright install webkit` once.
      name: 'iphone',
      use: { ...devices['iPhone 13'] },
      testMatch: /opening-flow\.spec\.js/,
      timeout: 60_000 // WebKit screenshots are slower on Windows
    },
    {
      name: 'desktop',
      use: { viewport: { width: 1440, height: 900 } }
    }
  ]
});
