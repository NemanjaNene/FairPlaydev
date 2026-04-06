const { test, expect } = require('@playwright/test');

test.describe('Profile Page', () => {
  test('should navigate to profile via homepage → MY PROFILE → PROFILE', async ({ page }) => {
    await page.goto('/');

    await page.getByText('MY PROFILE').click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    await page.getByText('PROFILE').click();
    await expect(page).toHaveURL(/\/dashboard\/profile/, { timeout: 10000 });

    await expect(page.getByText('Hello,')).toBeVisible();
  });

  test('should display personal information section', async ({ page }) => {
    await page.goto('/dashboard/profile');

    await expect(page.getByText('PERSONAL INFORMATION')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('First name')).toBeVisible();
    await expect(page.getByText('Last name')).toBeVisible();
  });

  test('should show correct user email in input field', async ({ page }) => {
    await page.goto('/dashboard/profile');

    const email = process.env.TEST_USER_EMAIL || '';
    const emailInput = page.locator('input').filter({ hasText: '' });
    const inputs = page.locator('input');
    const count = await inputs.count();

    let found = false;
    for (let i = 0; i < count; i++) {
      const value = await inputs.nth(i).inputValue();
      if (value.includes(email)) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  test('should display payment data section', async ({ page }) => {
    await page.goto('/dashboard/profile');

    await expect(page.getByText('PAYMENT DATA')).toBeVisible();
    await expect(page.getByText('Card credit')).toBeVisible();
    await expect(page.getByText('Expiration date')).toBeVisible();
    await expect(page.getByText('CHANGE PAYMENT METHOD')).toBeVisible();
    await expect(page.getByText('Delete payment method')).toBeVisible();
  });

  test('should show CHANGE PAYMENT METHOD button', async ({ page }) => {
    await page.goto('/dashboard/profile');

    await expect(page.getByText('CHANGE PAYMENT METHOD')).toBeVisible();
  });

  test('should show Delete payment method option', async ({ page }) => {
    await page.goto('/dashboard/profile');

    await expect(page.getByText('Delete payment method')).toBeVisible();
  });

  test('should display order history', async ({ page }) => {
    await page.goto('/dashboard/profile');

    await expect(page.getByText('ORDER HISTORY')).toBeVisible();
  });
});
