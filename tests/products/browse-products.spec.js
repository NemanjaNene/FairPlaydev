const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');

test.describe('Product Browsing', () => {
  test('should show active products on dashboard', async ({ page }) => {
    await page.goto('/dashboard/services/my-products');
    await expect(page.getByText('ACTIVE PRODUCTS')).toBeVisible();
  });

  test('should navigate to homepage by clicking FairPlay logo', async ({ page }) => {
    await page.goto('/dashboard/services/my-products');
    await page.locator('a[href="/"]').first().click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('link', { name: 'FREQUENT TRAVELLERS' })).toBeVisible();
    await expect(page.getByText('DAY PASSES').first()).toBeVisible();
    await expect(page.getByText('COVERAGE').first()).toBeVisible();
    await expect(page.getByText('MY PROFILE').first()).toBeVisible();
  });

  test('should display Flex subscription plans on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await selectProductTab(page, 'FAIRPLAY FLEX');

    await expect(page.getByRole('radio', { name: /6 MONTH.*€ 35/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /12 MONTH.*€ 30/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /24 MONTH.*€ 25/ })).toBeVisible();
  });

  test('should display Day Pass plans on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await selectProductTab(page, 'UNLIMITED');

    await expect(page.getByRole('radio', { name: /3 DAYS/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /7 DAYS/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /14 DAYS/ })).toBeVisible();
  });
});
