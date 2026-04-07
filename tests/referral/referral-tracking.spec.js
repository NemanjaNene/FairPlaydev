const { test, expect } = require('@playwright/test');
const { selectProductTab } = require('../helpers/products');
const { completePayment } = require('../helpers/payment');

const referralCode = '8908369.4f153d';
const referralAid = '8908369';
const referralCs = '4f153d';
const referralUrl = `/?rfsn=${referralCode}`;

test.describe('Referral Code Tracking', () => {
  test('should store affiliate code in cookie when visiting with referral link', async ({ page }) => {
    await page.goto(referralUrl);
    await page.waitForTimeout(3000);

    const cookies = await page.context().cookies();
    const affiliateCookie = cookies.find((c) => c.name === 'affiliateCode');
    expect(affiliateCookie).toBeTruthy();
    expect(affiliateCookie.value).toBe(referralCode);
  });

  test('should store referral data in localStorage', async ({ page }) => {
    await page.goto(referralUrl);
    await page.waitForTimeout(3000);

    const storageData = await page.evaluate(() => ({
      aid: localStorage.getItem('rfsn_v4_aid'),
      cs: localStorage.getItem('rfsn_v4_cs'),
      cartType: localStorage.getItem('rfsn_v4_cart_type'),
      id: localStorage.getItem('rfsn_v4_id'),
    }));

    expect(storageData.aid).toBe(referralAid);
    expect(storageData.cs).toBe(referralCs);
    expect(storageData.cartType).toBe('rfsn_v4_tracking');
    expect(storageData.id).not.toBeNull();
  });

  test('should persist cookie and localStorage through login', async ({ page }) => {
    await page.goto(referralUrl);
    await page.waitForTimeout(3000);

    let cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'affiliateCode')).toBeTruthy();

    const aidBefore = await page.evaluate(() => localStorage.getItem('rfsn_v4_aid'));
    expect(aidBefore).toBe(referralAid);

    await page.goto('/auth');
    await page.locator('input[type="email"]').first().waitFor({ state: 'visible' });
    await page.waitForTimeout(1000);

    await page.locator('input[type="email"]').first().click();
    await page.locator('input[type="email"]').first().pressSequentially(process.env.TEST_USER_EMAIL || '', { delay: 30 });

    await page.locator('input[type="password"]').first().click();
    await page.locator('input[type="password"]').first().pressSequentially(process.env.TEST_USER_PASSWORD || '', { delay: 30 });

    await page.getByRole('button', { name: 'LOG IN' }).click();
    await expect(page).not.toHaveURL(/\/auth/, { timeout: 15000 });

    cookies = await page.context().cookies();
    const affiliateCookie = cookies.find((c) => c.name === 'affiliateCode');
    expect(affiliateCookie).toBeTruthy();
    expect(affiliateCookie.value).toBe(referralCode);
  });
});

test.describe('Referral Purchase - PAID Request Verification', () => {
  test('should send PAID request with referral info after bundle purchase', async ({ page }) => {
    await page.goto(referralUrl);
    await page.waitForTimeout(3000);

    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'affiliateCode')).toBeTruthy();

    const aid = await page.evaluate(() => localStorage.getItem('rfsn_v4_aid'));
    expect(aid).toBe(referralAid);

    await page.goto('/auth');
    await page.locator('input[type="email"]').first().waitFor({ state: 'visible' });
    await page.waitForTimeout(1000);

    await page.locator('input[type="email"]').first().click();
    await page.locator('input[type="email"]').first().pressSequentially(process.env.TEST_USER_EMAIL || '', { delay: 30 });

    await page.locator('input[type="password"]').first().click();
    await page.locator('input[type="password"]').first().pressSequentially(process.env.TEST_USER_PASSWORD || '', { delay: 30 });

    await page.getByRole('button', { name: 'LOG IN' }).click();
    await expect(page).not.toHaveURL(/\/auth/, { timeout: 15000 });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const paidRequestPromise = page.waitForRequest(
      (req) => req.method() === 'POST' && req.url().includes('paid'),
      { timeout: 60000 }
    );

    await selectProductTab(page, 'DATA PACKAGES');

    await page.getByRole('radio', { name: /20 GB/ }).click();
    await page.getByRole('button', { name: 'BUY NOW' }).click();

    await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

    await completePayment(page);

    const paidRequest = await paidRequestPromise;
    const payload = paidRequest.postDataJSON();

    expect(payload).toHaveProperty('auto_credit_affiliate_id');
    expect(payload.auto_credit_affiliate_id).toBe(referralAid);

    expect(payload).toHaveProperty('items');
    expect(Array.isArray(payload.items)).toBe(true);
    expect(payload.items.length).toBeGreaterThan(0);
    expect(payload.items[0]).toHaveProperty('sku');

    expect(payload).toHaveProperty('cart_id');
    expect(payload).toHaveProperty('order_id');
  });
});
