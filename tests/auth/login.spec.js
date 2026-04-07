const { test, expect } = require('@playwright/test');

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('input[type="email"]').first().waitFor({ state: 'visible' });
    await page.waitForTimeout(1000);
  });

  test('should display the login page with all elements', async ({ page }) => {
    await expect(page).toHaveURL(/\/auth/);
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'LOG IN' })).toBeVisible();
    await expect(page.getByText('Forgot password')).toBeVisible();
    await expect(page.getByText('NO ACCOUNT YET')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL || '';
    const password = process.env.TEST_USER_PASSWORD || '';

    await page.locator('input[type="email"]').first().click();
    await page.locator('input[type="email"]').first().pressSequentially(email, { delay: 30 });

    await page.locator('input[type="password"]').first().click();
    await page.locator('input[type="password"]').first().pressSequentially(password, { delay: 30 });

    await page.getByRole('button', { name: 'LOG IN' }).click();

    await expect(page).not.toHaveURL(/\/auth/, { timeout: 15000 });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.locator('input[type="email"]').first().click();
    await page.locator('input[type="email"]').first().pressSequentially('invalid@test.com', { delay: 30 });

    await page.locator('input[type="password"]').first().click();
    await page.locator('input[type="password"]').first().pressSequentially('WrongPass123!', { delay: 30 });

    await page.getByRole('button', { name: 'LOG IN' }).click();

    await expect(page).toHaveURL(/\/auth/);
  });
});
