const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');

test.describe('Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Day Pass Purchase', () => {
    test.beforeEach(async ({ page }) => {
      await selectProductTab(page, 'UNLIMITED');
    });

    test('should show BUY NOW button when selecting 7 Day Pass', async ({ page }) => {
      await page.getByText('7 DAYS').click({ force: true });
      await expect(page.getByText('BUY NOW')).toBeVisible();
    });

    test('should show BUY NOW button when selecting 3 Day Pass', async ({ page }) => {
      await page.getByText('3 DAYS').click({ force: true });
      await expect(page.getByText('BUY NOW')).toBeVisible();
    });

    test('should show BUY NOW button when selecting 14 Day Pass', async ({ page }) => {
      await page.getByText('14 DAYS').click({ force: true });
      await expect(page.getByText('BUY NOW')).toBeVisible();
    });
  });

  test.describe('Flex Subscription Purchase', () => {
    test.beforeEach(async ({ page }) => {
      await selectProductTab(page, 'FAIRPLAY FLEX');
    });

    test('should show BUY NOW button when selecting 12 Month Flex', async ({ page }) => {
      await page.getByText('12 MONTH').click({ force: true });
      await expect(page.getByText('BUY NOW')).toBeVisible();
    });

    test('should show BUY NOW button when selecting 24 Month Flex', async ({ page }) => {
      await page.getByText('24 MONTH').click({ force: true });
      await expect(page.getByText('BUY NOW')).toBeVisible();
    });

    test('should show BUY NOW button when selecting 6 Month Flex', async ({ page }) => {
      await page.getByText('6 MONTH').click({ force: true });
      await expect(page.getByText('BUY NOW')).toBeVisible();
    });
  });
});
