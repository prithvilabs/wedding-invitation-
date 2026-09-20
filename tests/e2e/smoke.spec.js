import { test, expect } from '@playwright/test';

test('temple entrance scene renders with no console errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('/');
  await expect(page.locator('.temple-tap-begin')).toBeVisible();
  await expect(page).toHaveTitle(/Prithvi Raj/);

  expect(errors).toEqual([]);
});
