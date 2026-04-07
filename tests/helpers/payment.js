const { expect } = require('@playwright/test');

async function fillStripeTestCard(page, opts = {}) {
  const number = String(opts.number || '4242424242424242').replace(/\s/g, '');
  const expiry = String(opts.expiry || '1234').replace(/\D/g, '');
  const cvv = opts.cvv || '123';

  const stripeSelector = 'iframe[src*="js.stripe.com"]';
  await page.locator(stripeSelector).first().waitFor({ timeout: 20000 });
  const iframeCount = await page.locator(stripeSelector).count();
  const stripe = page.frameLocator(stripeSelector);

  if (iframeCount === 1) {
    const frame = stripe.first();
    await frame.locator('input[name="cardnumber"]').fill(number);

    const expInput = frame.locator('input[autocomplete="cc-exp"]');
    if (await expInput.count() > 0) await expInput.fill(expiry);

    const cvcInput = frame.locator('input[name="cc-csc"]');
    if (await cvcInput.count() > 0) await cvcInput.fill(cvv);
  } else {
    for (let i = 0; i < iframeCount; i++) {
      const frame = stripe.nth(i);

      const cardInput = frame.getByRole('textbox', { name: /card number/i });
      if (await cardInput.count() > 0) {
        await cardInput.fill(number);
        continue;
      }

      const expInput = frame.getByRole('textbox', { name: /expiration date/i });
      if (await expInput.count() > 0) {
        await expInput.fill(expiry);
        continue;
      }

      const cvvInput = frame.getByRole('textbox', { name: /CVC|CVV/i });
      if (await cvvInput.count() > 0) {
        await cvvInput.fill(cvv);
        continue;
      }
    }
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
  const input = page.getByPlaceholder('Card holder name');
  await input.clear();
  await input.fill(name);
}

async function fillBillingAddress(page, opts = {}) {
  const { state = 'California', postalCode = '10001', country = 'Germany' } = opts;

  const countryDropdown = page.getByText('Select a country');
  if (await countryDropdown.count() > 0) {
    await countryDropdown.click();
    await page.getByText(country, { exact: true }).click();
    await page.waitForTimeout(500);
  }

  const stateInput = page.getByPlaceholder('State');
  if (await stateInput.count() > 0) {
    await stateInput.clear();
    await stateInput.fill(state);
  }

  const postalInput = page.getByPlaceholder('Postal Code');
  if (await postalInput.count() > 0) {
    await postalInput.clear();
    await postalInput.fill(postalCode);
  }
}

async function isCardSaved(page) {
  const stripeCount = await page.locator('iframe[src*="js.stripe.com"]').count();

  if (stripeCount > 0) {
    const stripe = page.frameLocator('iframe[src*="js.stripe.com"]').first();

    let cardInput = stripe.locator('input[name="cardnumber"]');
    if (await cardInput.count() === 0) {
      cardInput = stripe.getByRole('textbox', { name: /card number/i });
    }

    if (await cardInput.count() > 0) {
      const placeholder = await cardInput.getAttribute('placeholder').catch(() => '') || '';
      const val = await cardInput.inputValue().catch(() => '') || '';
      return /\d{4}/.test(placeholder) || /\d{4}/.test(val);
    }
  }

  const cardInput = page.getByText('Card number').locator('..').locator('input:visible').first();
  if (await cardInput.count() > 0) {
    const val = await cardInput.inputValue().catch(() => '') || '';
    return /\d{4}/.test(val);
  }

  return false;
}

async function completePayment(page, opts = {}) {
  const { name = 'Test User', number = '4242424242424242', expiry = '12/34', cvv = '123' } = opts;

  await expect(page.getByText('PAYMENT DETAILS')).toBeVisible();
  await expect(page.getByText('ORDER SUMMARY')).toBeVisible();

  await page.waitForTimeout(4000);

  const saved = await isCardSaved(page);

  if (!saved) {
    await fillPaymentTestCard(page, { number, expiry, cvv });
    await fillPaymentCardholderName(page, name);
  }

  await fillBillingAddress(page);

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
  await expect(page).not.toHaveURL(/\/payment/, { timeout });
  await page.waitForTimeout(3000);
  await page.goto('/dashboard/services/my-products');
  await page.waitForLoadState('domcontentloaded');

  const activeProducts = page.getByText('ACTIVE PRODUCTS');
  const activationInProgress = page.getByText('ACTIVATION IN PROGRESS');

  await expect(activeProducts.or(activationInProgress)).toBeVisible({ timeout: 15000 });
}

module.exports = {
  fillStripeTestCard,
  fillPaymentTestCard,
  fillPaymentCardholderName,
  fillBillingAddress,
  isCardSaved,
  completePayment,
  clickPayNow,
  expectPurchaseSuccess,
};
