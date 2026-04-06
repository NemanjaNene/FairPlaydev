const { test, expect } = require('@playwright/test');

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
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

    await page.locator('input[type="email"]').first().fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await page.getByRole('button', { name: 'LOG IN' }).click();

    await expect(page).not.toHaveURL(/\/auth/, { timeout: 15000 });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.locator('input[type="email"]').first().fill('invalid@test.com');
    await page.locator('input[type="password"]').first().fill('WrongPass123!');
    await page.getByRole('button', { name: 'LOG IN' }).click();

    await expect(page).toHaveURL(/\/auth/);
  });
});
