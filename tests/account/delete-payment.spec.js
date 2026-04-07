const { test, expect } = require('@playwright/test');

test.describe('Delete Payment Method', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/profile');
  });

  test('should show error when trying to delete payment method with active subscription', async ({ page }) => {
    await page.waitForTimeout(2000);
    test.skip(!(await page.getByText('Delete payment method').isVisible().catch(() => false)), 'No payment method saved on this profile');

    await page.getByText('Delete payment method').scrollIntoViewIfNeeded();
    await page.getByText('Delete payment method').click();

    await expect(
      page.getByText('This payment method is linked to active subscription and cannot be removed')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should keep payment data visible after failed delete attempt', async ({ page }) => {
    await page.waitForTimeout(2000);
    test.skip(!(await page.getByText('Delete payment method').isVisible().catch(() => false)), 'No payment method saved on this profile');

    await page.getByText('Delete payment method').scrollIntoViewIfNeeded();
    await page.getByText('Delete payment method').click();

    await expect(
      page.getByText('This payment method is linked to active subscription and cannot be removed')
    ).toBeVisible({ timeout: 10000 });

    await expect(page.getByText('Card credit')).toBeVisible();
    await expect(page.getByText('Expiration date')).toBeVisible();
    await expect(page.getByText('CHANGE PAYMENT METHOD')).toBeVisible();
  });
});
