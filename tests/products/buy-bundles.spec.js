const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');

test.describe('Data Packages Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await selectProductTab(page, 'DATA PACKAGES');
  });

  test('should display DATA PACKAGES section', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'DATA PACKAGES' })).toBeVisible();
  });

  test('should display all bundle cards with correct data amounts', async ({ page }) => {
    await expect(page.getByRole('radio', { name: /1 GB/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /2 GB/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /3 GB/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /5 GB/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /10 GB/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /20 GB/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /50 GB/ })).toBeVisible();
  });

  test('should display correct prices for bundles', async ({ page }) => {
    await expect(page.getByRole('radio', { name: /1 GB.*€ 5(?:\s|$)/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /2 GB.*€ 7/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /3 GB.*€ 10/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /5 GB.*€ 15/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /10 GB.*€ 25/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /20 GB.*€ 35/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /50 GB.*€ 75/ })).toBeVisible();
  });

  test('should display validity info', async ({ page }) => {
    await expect(page.getByRole('radio', { name: /30 DAYS/ }).first()).toBeVisible();
  });

  test('should show BUY NOW when selecting a bundle', async ({ page }) => {
    await page.getByRole('radio', { name: /1 GB/ }).click();
    await expect(page.getByRole('button', { name: 'BUY NOW' })).toBeVisible();
  });
});
