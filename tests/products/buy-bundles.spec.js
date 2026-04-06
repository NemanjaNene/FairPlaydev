const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');
const { completePayment } = require('../helpers/payment');

test.describe('Data Packages Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await selectProductTab(page, 'DATA PACKAGES');
  });

  test('should display DATA PACKAGES section', async ({ page }) => {
    await expect(page.getByText('DATA PACKAGES')).toBeVisible();
  });

  test('should display all bundle cards with correct data amounts', async ({ page }) => {
    await expect(page.getByText('1 GB')).toBeVisible();
    await expect(page.getByText('2 GB')).toBeVisible();
    await expect(page.getByText('3 GB')).toBeVisible();
    await expect(page.getByText('5 GB')).toBeVisible();
    await expect(page.getByText('10 GB')).toBeVisible();
    await expect(page.getByText('20 GB')).toBeVisible();
    await expect(page.getByText('50 GB')).toBeVisible();
  });

  test('should display correct prices for bundles', async ({ page }) => {
    await expect(page.getByText(/€\s*5(?:[^0-9]|$)/)).toBeVisible();
    await expect(page.getByText(/€\s*7\.5/)).toBeVisible();
    await expect(page.getByText(/€\s*10(?:[^0-9]|$)/)).toBeVisible();
    await expect(page.getByText(/€\s*15(?:[^0-9]|$)/)).toBeVisible();
    await expect(page.getByText(/€\s*25(?:[^0-9]|$)/)).toBeVisible();
    await expect(page.getByText(/€\s*35(?:[^0-9]|$)/)).toBeVisible();
    await expect(page.getByText(/€\s*75(?:[^0-9]|$)/)).toBeVisible();
  });

  test('should display validity info', async ({ page }) => {
    await expect(page.getByText('30 DAYS')).toBeVisible();
  });

  test('should show BUY NOW when selecting a bundle', async ({ page }) => {
    await page.getByText('1 GB').click({ force: true });
    await expect(page.getByText('BUY NOW')).toBeVisible();
  });
});

test.describe('Purchase Bundle - Complete Flow', () => {
  test('should buy 1GB bundle and see it on dashboard', async ({ page }) => {
    await page.goto('/');

    await selectProductTab(page, 'DATA PACKAGES');

    await page.getByText('1 GB').scrollIntoViewIfNeeded();
    await page.getByText('1 GB').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

    await completePayment(page);

    await expect(page).toHaveURL(/\/dashboard|success(full)?-purchase/, { timeout: 30000 });

    const url = page.url();
    if (url.includes('success')) {
      await page.getByText('GO TO DASHBOARD').click();
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    }

    await expect(page.getByText('ACTIVE PRODUCTS')).toBeVisible();
    await expect(page.getByText(/1\s*GB.*Data.*package|Data.*package.*1\s*GB|1\s*GB/i)).toBeVisible();
  });
});
