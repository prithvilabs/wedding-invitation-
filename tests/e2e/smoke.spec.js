import { test, expect } from '@playwright/test';

test('home page renders with no console errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  // Open the curtains (covered in detail by opening-flow.spec.js)
  await page.goto('/');
  await page.getByRole('button', { name: 'Open the wedding invitation' }).click({ force: true });
  await expect(page.getByTestId('curtain-opening')).toHaveCount(0, { timeout: 6000 });
  await expect(page).toHaveTitle(/Prithvi Raj/);
  await expect(
    page.getByRole('heading', { level: 1, name: /Prithvi Raj weds Harshini/i })
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'RSVP', level: 2 })).toBeAttached();

  expect(errors).toEqual([]);
});
