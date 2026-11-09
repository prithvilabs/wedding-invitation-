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
      // Chromium-based mobile emulation (this environment only ships Chromium,
      // not WebKit, so device profiles like 'iPhone 13' are not usable here).
      name: 'mobile',
      use: { ...devices['Pixel 7'] }
    },
    {
      name: 'desktop',
      use: { viewport: { width: 1440, height: 900 } }
    }
  ]
});
