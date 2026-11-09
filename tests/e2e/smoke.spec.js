import { test, expect } from '@playwright/test';

test('home page renders with no console errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  // Skip the one-time opening animation (covered by opening-flow.spec.js)
  await page.addInitScript(() => sessionStorage.setItem('prh-invitation-opened', '1'));
  await page.goto('/');
  await expect(page).toHaveTitle(/Prithvi Raj/);
  await expect(
    page.getByRole('heading', { level: 1, name: /Prithvi Raj weds Harshini/i })
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'RSVP', level: 2 })).toBeAttached();

  expect(errors).toEqual([]);
});
