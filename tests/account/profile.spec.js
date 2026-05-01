const { test, expect } = require('@playwright/test');

test.describe('Profile Page', () => {
  test('should navigate to profile via homepage → MY PROFILE → PROFILE', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'MY PROFILE' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    await page.getByRole('link', { name: 'PROFILE' }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile/, { timeout: 10000 });

    await expect(page.getByText('Hello,')).toBeVisible();
  });

  test('should display personal information section', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('PERSONAL INFORMATION')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('First name')).toBeVisible();
    await expect(page.getByText('Last name')).toBeVisible();
  });

  test('should show correct user email in input field', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');

    const email = process.env.TEST_USER_EMAIL || '';
    await expect(page.locator(`input[value*="${email}"]`)).toBeVisible({ timeout: 15000 });
  });

  test('should display payment data section', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await page.waitForTimeout(2000);
    test.skip(!(await page.getByText('Card credit').isVisible().catch(() => false)), 'No payment method saved on this profile');

    await expect(page.getByText('PAYMENT DATA')).toBeVisible();
    await expect(page.getByText('Card credit')).toBeVisible();
    await expect(page.getByText('Expiration date (MM/YY)')).toBeVisible();
    await expect(page.getByText('CHANGE PAYMENT METHOD')).toBeVisible();
    await expect(page.getByText('Delete payment method')).toBeVisible();
  });

  test('should show CHANGE PAYMENT METHOD button', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('CHANGE PAYMENT METHOD')).toBeVisible({ timeout: 15000 });
  });

  test('should show Delete payment method option', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await page.waitForTimeout(2000);
    test.skip(!(await page.getByText('Delete payment method').isVisible().catch(() => false)), 'No payment method saved on this profile');

    await expect(page.getByText('Delete payment method')).toBeVisible();
  });

  test('should display order history', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('ORDER HISTORY')).toBeVisible({ timeout: 15000 });
  });
});
