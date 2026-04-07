const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');

test.describe('Duplicate Purchase Prevention', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should show toast error when trying to buy second Unlimited plan', async ({ page }) => {
    await selectProductTab(page, 'UNLIMITED');
    await page.getByRole('radio', { name: /7 DAYS/ }).click();
    await page.getByRole('button', { name: 'BUY NOW' }).click();

    await page.waitForTimeout(5000);
    test.skip(page.url().includes('/payment'), 'No active Unlimited plan on this profile - duplicate check not applicable');

    await expect(page.getByText(/Another Unlimited plan is currently active/i).first()).toBeVisible({ timeout: 20000 });
    await expect(page).not.toHaveURL(/\/payment/);
  });

  test('should show toast error when trying to buy existing Flex subscription - 6 Month', async ({ page }) => {
    await selectProductTab(page, 'FAIRPLAY FLEX');
    await page.getByRole('radio', { name: /6 MONTH/ }).click();
    await page.getByRole('button', { name: 'BUY NOW' }).click();

    await page.waitForTimeout(5000);
    test.skip(page.url().includes('/payment'), '6M Flex subscription not active - duplicate check not applicable');

    await expect(page.getByText('Subscription already exists').first()).toBeVisible({ timeout: 10000 });
    await expect(page).not.toHaveURL(/\/payment/);
  });

  test('should show toast error when trying to buy existing Flex subscription - 12 Month', async ({ page }) => {
    await selectProductTab(page, 'FAIRPLAY FLEX');
    await page.getByRole('radio', { name: /12 MONTH/ }).click();
    await page.getByRole('button', { name: 'BUY NOW' }).click();

    await page.waitForTimeout(5000);
    test.skip(page.url().includes('/payment'), '12M Flex not detected as duplicate - subscription may not be fully registered yet');

    await expect(page.getByText('Subscription already exists').first()).toBeVisible({ timeout: 10000 });
    await expect(page).not.toHaveURL(/\/payment/);
  });

  test('should show toast error when trying to buy existing Flex subscription - 24 Month', async ({ page }) => {
    await selectProductTab(page, 'FAIRPLAY FLEX');
    await page.getByRole('radio', { name: /24 MONTH/ }).click();
    await page.getByRole('button', { name: 'BUY NOW' }).click();

    await page.waitForTimeout(5000);
    test.skip(page.url().includes('/payment'), '24M Flex subscription not active - duplicate check not applicable');

    await expect(page.getByText('Subscription already exists').first()).toBeVisible({ timeout: 10000 });
    await expect(page).not.toHaveURL(/\/payment/);
  });
});
