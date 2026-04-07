const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');

test.describe('Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Day Pass Purchase', () => {
    test.beforeEach(async ({ page }) => {
      await selectProductTab(page, 'UNLIMITED');
    });

    test('should show BUY NOW button when selecting 7 Day Pass', async ({ page }) => {
      await page.getByRole('radio', { name: /7 DAYS/ }).click();
      await expect(page.getByRole('button', { name: 'BUY NOW' })).toBeVisible();
    });

    test('should show BUY NOW button when selecting 3 Day Pass', async ({ page }) => {
      await page.getByRole('radio', { name: /3 DAYS/ }).click();
      await expect(page.getByRole('button', { name: 'BUY NOW' })).toBeVisible();
    });

    test('should show BUY NOW button when selecting 14 Day Pass', async ({ page }) => {
      await page.getByRole('radio', { name: /14 DAYS/ }).click();
      await expect(page.getByRole('button', { name: 'BUY NOW' })).toBeVisible();
    });
  });

  test.describe('Flex Subscription Purchase', () => {
    test.beforeEach(async ({ page }) => {
      await selectProductTab(page, 'FAIRPLAY FLEX');
    });

    test('should show BUY NOW button when selecting 12 Month Flex', async ({ page }) => {
      await page.getByRole('radio', { name: /12 MONTH/ }).click();
      await expect(page.getByRole('button', { name: 'BUY NOW' })).toBeVisible();
    });

    test('should show BUY NOW button when selecting 24 Month Flex', async ({ page }) => {
      await page.getByRole('radio', { name: /24 MONTH/ }).click();
      await expect(page.getByRole('button', { name: 'BUY NOW' })).toBeVisible();
    });

    test('should show BUY NOW button when selecting 6 Month Flex', async ({ page }) => {
      await page.getByRole('radio', { name: /6 MONTH/ }).click();
      await expect(page.getByRole('button', { name: 'BUY NOW' })).toBeVisible();
    });
  });
});
