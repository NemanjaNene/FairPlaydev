const { test, expect } = require('@playwright/test');
const { selectProductTab, containsEuroPrice } = require('../helpers/products');

test.describe('Product Browsing', () => {
  test('should show active products on dashboard', async ({ page }) => {
    await page.goto('/dashboard/services/my-products');
    await expect(page.getByText('ACTIVE PRODUCTS')).toBeVisible();
  });

  test('should navigate to homepage by clicking FairPlay logo', async ({ page }) => {
    await page.goto('/dashboard/services/my-products');
    await page.locator('a[href="/"]').first().click();

    await expect(page.getByText('FREQUENT TRAVELLERS')).toBeVisible();
    await expect(page.getByText('DAY PASSES')).toBeVisible();
    await expect(page.getByText('COVERAGE')).toBeVisible();
    await expect(page.getByText('MY PROFILE')).toBeVisible();
  });

  test('should display Flex subscription plans on homepage', async ({ page }) => {
    await page.goto('/');

    await selectProductTab(page, 'FAIRPLAY FLEX');

    await containsEuroPrice(page, 25);
    await containsEuroPrice(page, 30);
    await containsEuroPrice(page, 35);
    await expect(page.getByText('24')).toBeVisible();
    await expect(page.getByText('12')).toBeVisible();
    await expect(page.getByText('6')).toBeVisible();
  });

  test('should display Day Pass plans on homepage', async ({ page }) => {
    await page.goto('/');

    await selectProductTab(page, 'UNLIMITED');

    await expect(page.getByText('3 DAYS')).toBeVisible();
    await expect(page.getByText('7 DAYS')).toBeVisible();
    await expect(page.getByText('14 DAYS')).toBeVisible();
  });
});
