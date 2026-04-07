const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');

test.describe('Price Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('FairPlay Flex Subscriptions', () => {
    test.beforeEach(async ({ page }) => {
      await selectProductTab(page, 'FAIRPLAY FLEX');
    });

    test('should display correct price for 24 Month Subscription', async ({ page }) => {
      await expect(page.getByRole('radio', { name: /24 MONTH.*€ 25/ })).toBeVisible();
    });

    test('should display correct price for 12 Month Subscription', async ({ page }) => {
      await expect(page.getByRole('radio', { name: /12 MONTH.*€ 30/ })).toBeVisible();
    });

    test('should display correct price for 6 Month Subscription', async ({ page }) => {
      await expect(page.getByRole('radio', { name: /6 MONTH.*€ 35/ })).toBeVisible();
    });

    test('should mark 24 Month as MOST POPULAR', async ({ page }) => {
      await expect(page.getByRole('radio', { name: /MOST POPULAR.*24 MONTH/ })).toBeVisible();
    });
  });

  test.describe('FairPlay Unlimited Day Passes', () => {
    test.beforeEach(async ({ page }) => {
      await selectProductTab(page, 'UNLIMITED');
    });

    test('should display correct price for 3 Day Pass - €25', async ({ page }) => {
      await expect(page.getByRole('radio', { name: /3 DAYS.*€ 25/ })).toBeVisible();
    });

    test('should display correct price for 7 Day Pass - €50', async ({ page }) => {
      await expect(page.getByRole('radio', { name: /7 DAYS.*€ 50/ })).toBeVisible();
    });

    test('should display correct price for 14 Day Pass - €75', async ({ page }) => {
      await expect(page.getByRole('radio', { name: /14 DAYS.*€ 75/ })).toBeVisible();
    });

    test('should show daily rate for Day Passes', async ({ page }) => {
      await expect(page.getByRole('radio', { name: /8[.,]33/ })).toBeVisible();
      await expect(page.getByRole('radio', { name: /7[.,]14/ })).toBeVisible();
      await expect(page.getByRole('radio', { name: /5[.,]36/ })).toBeVisible();
    });
  });
});
