const { test, expect } = require('@playwright/test');

const authFile = '.auth/user.json';

test('authenticate', async ({ page }) => {
  await page.goto('/auth');

  await page.locator('input[type="email"]').first().fill(process.env.TEST_USER_EMAIL || '');
  await page.locator('input[type="password"]').first().fill(process.env.TEST_USER_PASSWORD || '');
  await page.getByRole('button', { name: 'LOG IN' }).click();

  await expect(page).not.toHaveURL(/\/auth/, { timeout: 15000 });

  await page.context().storageState({ path: authFile });
});
