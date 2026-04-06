const { expect } = require('@playwright/test');

async function fillStripeTestCard(page, opts = {}) {
  const number = String(opts.number || '4242424242424242').replace(/\s/g, '');
  const expiry = String(opts.expiry || '1234').replace(/\D/g, '');
  const cvv = opts.cvv || '123';

  const stripeSelector = 'iframe[src*="js.stripe.com"]';
  await page.locator(stripeSelector).first().waitFor({ timeout: 20000 });
  const iframeCount = await page.locator(stripeSelector).count();

  const stripe = page.frameLocator(stripeSelector);

  if (iframeCount >= 3) {
    await stripe.nth(0).locator('input').fill(number);
    await stripe.nth(1).locator('input').fill(expiry);
    await stripe.nth(2).locator('input').fill(cvv);
  } else {
    await stripe.nth(0).locator('input').fill(number);
    if (iframeCount > 1) await stripe.nth(1).locator('input').fill(expiry);
    if (iframeCount > 2) await stripe.nth(2).locator('input').fill(cvv);
  }
}

async function fillPaymentTestCard(page, opts = {}) {
  const number = String(opts.number || '4242424242424242').replace(/\s/g, '');
  const cvv = opts.cvv || '123';
  const rawExpiry = opts.expiry || '12/34';
  const expiryForDom = opts.expiryDisplay || rawExpiry;
  const expiryDigits = String(rawExpiry).replace(/\D/g, '');

  const stripeCount = await page.locator('iframe[src*="js.stripe.com"]').count();

  if (stripeCount > 0) {
    await fillStripeTestCard(page, { ...opts, expiry: expiryDigits });
  } else {
    await page.getByText('Card number').locator('..').locator('input:visible').first().fill(number);
    await page.getByText('Expiry date').locator('..').locator('input:visible').first().fill(expiryForDom);

    const cvvLabel = page.getByText('CVV code');
    if (await cvvLabel.count() > 0) {
      await cvvLabel.locator('..').locator('input:visible').first().fill(cvv);
    } else {
      const cvcInput = page.locator(
        'input[autocomplete*="cvc"], input[autocomplete*="csc"], input[name*="cvc"]'
      ).first();
      if (await cvcInput.count() > 0) {
        await cvcInput.fill(cvv);
      }
    }
  }
}

async function fillPaymentCardholderName(page, name = 'Test User') {
  const input = page.getByText('Name and Surname of card holder').locator('..').locator('input');
  await input.clear();
  await input.fill(name);
}

async function completePayment(page, opts = {}) {
  const { name = 'Test User', number = '4242424242424242', expiry = '12/34', cvv = '123' } = opts;

  await expect(page.getByText('PAYMENT DETAILS')).toBeVisible();
  await expect(page.getByText('ORDER SUMMARY')).toBeVisible();

  await page.waitForTimeout(3000);

  const cardInput = page.getByText('Card number').locator('..').locator('input').first();
  const cardVal = await cardInput.inputValue().catch(() => '');
  const isSaved = cardVal && /\d{4}/.test(cardVal);

  if (!isSaved) {
    await fillPaymentTestCard(page, { number, expiry, cvv });
    await fillPaymentCardholderName(page, name);
  }

  await clickPayNow(page);
}

async function clickPayNow(page) {
  await page.getByText('ORDER SUMMARY').click({ force: true });
  const payButton = page.getByRole('button', { name: 'PAY NOW' });
  await payButton.scrollIntoViewIfNeeded();
  await expect(payButton).toBeEnabled();
  await payButton.click({ force: true });
}

async function expectPurchaseSuccess(page, timeout = 30000) {
  await expect(page).toHaveURL(/success(full)?-purchase/, { timeout });
}

module.exports = {
  fillStripeTestCard,
  fillPaymentTestCard,
  fillPaymentCardholderName,
  completePayment,
  clickPayNow,
  expectPurchaseSuccess,
};
