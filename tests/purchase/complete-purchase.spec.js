const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');
const { completePayment, expectPurchaseSuccess } = require('../helpers/payment');

test.describe('Complete Purchase Flow - Unlimited Day Pass', () => {
  test('should select 7 Day Pass and navigate to payment page', async ({ page }) => {
    await page.goto('/');

    await selectProductTab(page, 'UNLIMITED');
    await page.getByText('7 DAYS').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

    await expect(page.getByText('PAYMENT DETAILS')).toBeVisible();
    await expect(page.getByText('ORDER SUMMARY')).toBeVisible();
    await expect(page.getByText('TOTAL')).toBeVisible();
  });

  test('should verify payment form fields exist', async ({ page }) => {
    await page.goto('/');

    await selectProductTab(page, 'UNLIMITED');
    await page.getByText('7 DAYS').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

    await expect(page.getByText('Card number')).toBeVisible();
    await expect(page.getByText('Expiry date')).toBeVisible();
    await expect(page.getByText('Name and Surname of card holder')).toBeVisible();
    await expect(page.getByText('PAY NOW')).toBeVisible();
    await expect(page.getByText('CANCEL PAYMENT')).toBeVisible();
  });

  test('should complete payment and see success page', async ({ page }) => {
    await page.goto('/');

    await selectProductTab(page, 'UNLIMITED');
    await page.getByText('7 DAYS').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

    await completePayment(page);

    await expectPurchaseSuccess(page);
    await expect(page.getByText('CONGRATULATION')).toBeVisible();
    await expect(page.getByText('Thank you for your purchase')).toBeVisible();
    await expect(page.getByText('GO TO DASHBOARD')).toBeVisible();
  });

  test('should redirect to dashboard and show purchased product', async ({ page }) => {
    await page.goto('/');

    await selectProductTab(page, 'UNLIMITED');
    await page.getByText('7 DAYS').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

    await completePayment(page);

    await expectPurchaseSuccess(page);
    await page.getByText('GO TO DASHBOARD').click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await expect(page.getByText('ACTIVE PRODUCTS')).toBeVisible();
  });
});

test.describe('Complete Purchase Flow - Flex Subscription', () => {
  test('should select 12 Month Flex and navigate to payment page', async ({ page }) => {
    await page.goto('/');

    await selectProductTab(page, 'FAIRPLAY FLEX');
    await page.getByText('12 MONTH').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

    await expect(page.getByText('PAYMENT DETAILS')).toBeVisible();
    await expect(page.getByText('ORDER SUMMARY')).toBeVisible();
  });

  test('should complete Flex payment and see success page', async ({ page }) => {
    await page.goto('/');

    await selectProductTab(page, 'FAIRPLAY FLEX');
    await page.getByText('12 MONTH').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

    await completePayment(page);

    await expectPurchaseSuccess(page);
    await expect(page.getByText('CONGRATULATION')).toBeVisible();
    await expect(page.getByText('Thank you for your purchase')).toBeVisible();
  });
});

test.describe('Cancel Payment', () => {
  test('should cancel payment and return from payment page', async ({ page }) => {
    await page.goto('/');

    await selectProductTab(page, 'UNLIMITED');
    await page.getByText('7 DAYS').click({ force: true });
    await page.getByText('BUY NOW').click();

    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

    await page.getByText('CANCEL PAYMENT').click();
    await expect(page).not.toHaveURL(/\/payment/, { timeout: 10000 });
  });
});
