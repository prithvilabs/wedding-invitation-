import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright setup for the visual/functional verification loop:
 * IMPLEMENTATION -> PLAYWRIGHT -> VISUAL + FUNCTIONAL VERIFICATION -> ITERATE.
 * Assumes `npm run dev` is already serving the app at baseURL.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000/wedding-invitation-/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // This environment ships a pre-installed Chromium pinned to a specific
    // revision under /opt/pw-browsers rather than whatever revision this
    // @playwright/test version would normally fetch. Point at it directly
    // instead of downloading a matching browser (do not run `playwright install`).
    launchOptions: { executablePath: '/opt/pw-browsers/chromium' }
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
