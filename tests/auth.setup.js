const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const authFile = '.auth/user.json';

test('authenticate', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  await page.goto('/auth');
  await page.waitForLoadState('domcontentloaded');

  const emailInput = page.locator('input[type="email"]').first();
  await emailInput.waitFor({ state: 'visible' });
  await page.waitForTimeout(1000);

  await emailInput.click();
  await emailInput.pressSequentially(process.env.TEST_USER_EMAIL || '', { delay: 30 });

  const passInput = page.locator('input[type="password"]').first();
  await passInput.click();
  await passInput.pressSequentially(process.env.TEST_USER_PASSWORD || '', { delay: 30 });

  await page.getByRole('button', { name: 'LOG IN' }).click();

  await expect(page).not.toHaveURL(/\/auth/, { timeout: 15000 });

  await page.context().storageState({ path: authFile });
});
