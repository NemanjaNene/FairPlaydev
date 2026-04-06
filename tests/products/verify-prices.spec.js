const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');

test.describe('Price Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('FairPlay Flex Subscriptions', () => {
    test.beforeEach(async ({ page }) => {
      await selectProductTab(page, 'FAIRPLAY FLEX');
    });

    test('should display correct price for 24 Month Subscription', async ({ page }) => {
      const card = page.getByText('24 MONTH').locator('..').locator('..');
      await expect(card.getByText('25')).toBeVisible();
    });

    test('should display correct price for 12 Month Subscription', async ({ page }) => {
      const card = page.getByText('12 MONTH').locator('..').locator('..');
      await expect(card.getByText('30')).toBeVisible();
    });

    test('should display correct price for 6 Month Subscription', async ({ page }) => {
      const card = page.getByText('6 MONTH').locator('..').locator('..');
      await expect(card.getByText('35')).toBeVisible();
    });

    test('should mark 24 Month as MOST POPULAR', async ({ page }) => {
      await expect(page.getByText('MOST POPULAR')).toBeVisible();
    });
  });

  test.describe('FairPlay Unlimited Day Passes', () => {
    test.beforeEach(async ({ page }) => {
      await selectProductTab(page, 'UNLIMITED');
    });

    test('should display correct price for 3 Day Pass - €25', async ({ page }) => {
      const card = page.getByText('3 DAYS').locator('..').locator('..');
      await expect(card.getByText('25')).toBeVisible();
    });

    test('should display correct price for 7 Day Pass - €50', async ({ page }) => {
      const card = page.getByText('7 DAYS').locator('..').locator('..');
      await expect(card.getByText('50')).toBeVisible();
    });

    test('should display correct price for 14 Day Pass - €75', async ({ page }) => {
      const card = page.getByText('14 DAYS').locator('..').locator('..');
      await expect(card.getByText('75')).toBeVisible();
    });

    test('should show daily rate for Day Passes', async ({ page }) => {
      await expect(page.getByText(/8[.,]33/)).toBeVisible();
      await expect(page.getByText(/7[.,]14/)).toBeVisible();
      await expect(page.getByText(/5[.,]36/)).toBeVisible();
    });
  });
});
