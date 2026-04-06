const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');

test.describe('Duplicate Purchase Prevention', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show toast error when trying to buy second Unlimited plan', async ({ page }) => {
    await selectProductTab(page, 'UNLIMITED');
    await page.getByText('7 DAYS').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page.getByText(/Another Unlimited plan is currently active/i)).toBeVisible({ timeout: 20000 });
    await expect(page).not.toHaveURL(/\/payment/);
  });

  test('should show toast error when trying to buy existing Flex subscription - 6 Month', async ({ page }) => {
    await selectProductTab(page, 'FAIRPLAY FLEX');
    await page.getByText('6 MONTH').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page.getByText('Subscription already exists')).toBeVisible({ timeout: 10000 });
    await expect(page).not.toHaveURL(/\/payment/);
  });

  test('should show toast error when trying to buy existing Flex subscription - 12 Month', async ({ page }) => {
    await selectProductTab(page, 'FAIRPLAY FLEX');
    await page.getByText('12 MONTH').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page.getByText('Subscription already exists')).toBeVisible({ timeout: 10000 });
    await expect(page).not.toHaveURL(/\/payment/);
  });

  test('should show toast error when trying to buy existing Flex subscription - 24 Month', async ({ page }) => {
    await selectProductTab(page, 'FAIRPLAY FLEX');
    await page.getByText('24 MONTH').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page.getByText('Subscription already exists')).toBeVisible({ timeout: 10000 });
    await expect(page).not.toHaveURL(/\/payment/);
  });
});
