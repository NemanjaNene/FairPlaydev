describe('Referral Code Tracking', () => {
  const referralCode = '8908369.4f153d';
  const referralAid = '8908369';
  const referralCs = '4f153d';
  const referralUrl = `/?rfsn=${referralCode}`;

  // ========== TEST 1: Cookie provera ==========
  it('should store affiliate code in cookie when visiting with referral link', () => {
    cy.visitDev(referralUrl);
    cy.wait(3000);
    cy.screenshot('01-referral-landing-page');

    cy.getCookie('affiliateCode').should('exist').then((cookie) => {
      cy.task('log', `COOKIE affiliateCode: ${cookie.value}`);
      expect(cookie.value).to.equal(referralCode);
    });
  });

  // ========== TEST 2: localStorage provera ==========
  it('should store referral data in localStorage', () => {
    cy.visitDev(referralUrl);
    cy.wait(3000);
    cy.screenshot('02-referral-localStorage-check');

    cy.window().then((win) => {
      const aid = win.localStorage.getItem('rfsn_v4_aid');
      const cs = win.localStorage.getItem('rfsn_v4_cs');
      const cartType = win.localStorage.getItem('rfsn_v4_cart_type');
      const id = win.localStorage.getItem('rfsn_v4_id');

      cy.task('log', `LOCAL STORAGE rfsn_v4_aid: ${aid}`);
      cy.task('log', `LOCAL STORAGE rfsn_v4_cs: ${cs}`);
      cy.task('log', `LOCAL STORAGE rfsn_v4_cart_type: ${cartType}`);
      cy.task('log', `LOCAL STORAGE rfsn_v4_id: ${id}`);

      expect(aid).to.equal(referralAid);
      expect(cs).to.equal(referralCs);
      expect(cartType).to.equal('rfsn_v4_tracking');
      expect(id).to.not.be.null;
    });
  });

  // ========== TEST 3 ==========
  it('should persist cookie and localStorage through login', () => {
    cy.visitDev(referralUrl);
    cy.wait(3000);

    cy.getCookie('affiliateCode').should('exist');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('rfsn_v4_aid')).to.equal(referralAid);
    });

    cy.visitDev('/auth');
    cy.wait(2000);
    cy.screenshot('03-login-page');

    cy.get('input[type="email"]').filter(':visible').first().clear().type(Cypress.env('testUserEmail'));
    cy.get('input[type="password"]').filter(':visible').first().type(Cypress.env('testUserPassword'));
    cy.contains('button', 'LOG IN').click();
    cy.url({ timeout: 15000 }).should('not.include', '/auth');
    cy.screenshot('04-after-login-dashboard');

    cy.getCookie('affiliateCode').should('exist').then((cookie) => {
      cy.task('log', `COOKIE after login - affiliateCode: ${cookie.value}`);
      expect(cookie.value).to.equal(referralCode);
    });

    cy.window().then((win) => {
      cy.task('log', `LOCAL STORAGE after login - rfsn_v4_aid: ${win.localStorage.getItem('rfsn_v4_aid')}`);
      cy.task('log', `LOCAL STORAGE after login - rfsn_v4_cs: ${win.localStorage.getItem('rfsn_v4_cs')}`);
    });
  });
});

describe('Referral Purchase - PAID Request Verification', () => {
  const referralCode = '8908369.4f153d';
  const referralAid = '8908369';
  const referralCs = '4f153d';
  const referralUrl = `/?rfsn=${referralCode}`;

  // ========== TEST 4: Kupovina bundla + PAID request verifikacija ==========
  it('should send PAID request with referral info after bundle purchase', () => {
    cy.visitDev(referralUrl);
    cy.wait(3000);
    cy.screenshot('05-referral-link-visit');

    cy.getCookie('affiliateCode').should('exist');
    cy.window().then((win) => {
      cy.task('log', `--- PRE-PURCHASE VERIFICATION ---`);
      cy.task('log', `COOKIE affiliateCode: ${referralCode}`);
      cy.task('log', `LOCAL STORAGE rfsn_v4_aid: ${win.localStorage.getItem('rfsn_v4_aid')}`);
      cy.task('log', `LOCAL STORAGE rfsn_v4_cs: ${win.localStorage.getItem('rfsn_v4_cs')}`);
      expect(win.localStorage.getItem('rfsn_v4_aid')).to.equal(referralAid);
    });

    cy.visitDev('/auth');
    cy.wait(2000);
    cy.get('input[type="email"]').filter(':visible').first().clear().type(Cypress.env('testUserEmail'));
    cy.get('input[type="password"]').filter(':visible').first().type(Cypress.env('testUserPassword'));
    cy.contains('button', 'LOG IN').click();
    cy.url({ timeout: 15000 }).should('not.include', '/auth');
    cy.screenshot('06-logged-in');

    cy.visitDev('/dashboard/services/my-products');
    cy.wait(2000);
    cy.screenshot('07-my-products-page');

    cy.intercept('POST', '**/paid*').as('paidRequest');
    cy.intercept('POST', '**/*paid*').as('paidRequest2');

    cy.contains('BUY BUNDLES', { timeout: 25000 }).scrollIntoView();
    cy.wait(1000);
    cy.screenshot('08-buy-bundles-section');

    cy.contains('20 GB').scrollIntoView();
    cy.contains(/€\s*35(?:[^0-9]|$)/).parent().parent().parent().contains('BUY').click();

    cy.url({ timeout: 15000 }).should('include', '/payment');

    cy.contains('PAYMENT DETAILS').should('be.visible');
    cy.contains('ORDER SUMMARY').should('be.visible');
    cy.screenshot('09-payment-page');

    cy.wait(4000);

    cy.clickPayNow();
    cy.screenshot('10-after-pay-now');

    cy.wait('@paidRequest', { timeout: 30000 }).then((interception) => {
      const payload = interception.request.body;

      cy.task('log', `--- PAID REQUEST CAPTURED ---`);
      cy.task('log', `PAID Request URL: ${interception.request.url}`);
      cy.task('log', `PAID Payload: ${JSON.stringify(payload, null, 2)}`);

      expect(payload).to.have.property('auto_credit_affiliate_id');
      expect(payload.auto_credit_affiliate_id).to.equal(referralAid);

      expect(payload).to.have.property('items');
      expect(payload.items).to.be.an('array');
      expect(payload.items.length).to.be.greaterThan(0);
      expect(payload.items[0]).to.have.property('sku');

      expect(payload).to.have.property('cart_id');
      expect(payload).to.have.property('order_id');

      cy.task('log', `--- VERIFICATION PASSED ---`);
      cy.task('log', `affiliate_id: ${payload.auto_credit_affiliate_id}`);
      cy.task('log', `items: ${JSON.stringify(payload.items)}`);
      cy.task('log', `cart_id: ${payload.cart_id}`);
      cy.task('log', `order_id: ${payload.order_id}`);
    });
  });
});
