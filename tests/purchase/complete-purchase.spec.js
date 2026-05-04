const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');

test.describe('Cancel Payment', () => {
  test('should cancel payment and return from payment page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await selectProductTab(page, 'DATA PACKAGES');
    await page.getByRole('radio', { name: /3 GB/ }).click();
    await page.getByRole('button', { name: 'BUY NOW' }).click();

    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

    await page.getByText('CANCEL PAYMENT').click();
    await expect(page).not.toHaveURL(/\/payment/, { timeout: 10000 });
  });
});
