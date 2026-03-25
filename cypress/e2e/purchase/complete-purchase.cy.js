describe('Complete Purchase Flow - Unlimited Day Pass', () => {
  const testCard = {
    number: '4242 4242 4242 4242',
    expiry: '12/34',
    cvv: '123',
    name: 'Test User'
  };

  beforeEach(() => {
    cy.login();
  });

  it('should select 7 Day Pass and navigate to payment page', () => {
    cy.visitDev('/');
    cy.wait(2000);

    cy.contains("FairPlay Unlimited").scrollIntoView();
    cy.wait(1500);
    cy.clickPriceContainingEuros(50);
    cy.wait(500);
    cy.contains('GO TO SECURE CHECKOUT').click();

    cy.url({ timeout: 15000 }).should('include', '/payment');
    cy.wait(2000);

    cy.contains('PAYMENT DETAILS').should('be.visible');
    cy.contains('ORDER SUMMARY').should('be.visible');
    cy.contains('UNLIMITED OneWorld 7 DAYS').should('be.visible');
    cy.contains('€50.00').should('be.visible');
    cy.contains('TOTAL').should('be.visible');
  });

  it('should verify payment form fields exist', () => {
    cy.visitDev('/');
    cy.wait(2000);

    cy.contains("FairPlay Unlimited").scrollIntoView();
    cy.wait(1500);
    cy.clickPriceContainingEuros(50);
    cy.wait(500);
    cy.contains('GO TO SECURE CHECKOUT').click();

    cy.url({ timeout: 15000 }).should('include', '/payment');
    cy.wait(2000);

    cy.contains('Card number').should('be.visible');
    cy.contains('Expiry date').should('be.visible');
    cy.contains('Name and Surname of card holder').should('be.visible');
    cy.contains('PAY NOW').should('be.visible');
    cy.contains('CANCEL PAYMENT').should('be.visible');
  });

  it('should complete payment and see success page', () => {
    cy.visitDev('/');
    cy.wait(2000);

    cy.contains("FairPlay Unlimited").scrollIntoView();
    cy.wait(1500);
    cy.clickPriceContainingEuros(50);
    cy.wait(500);
    cy.contains('GO TO SECURE CHECKOUT').click();

    cy.url({ timeout: 15000 }).should('include', '/payment');
    cy.wait(2000);

    cy.fillPaymentCardholderName(testCard.name);
    cy.fillPaymentTestCard({
      number: testCard.number,
      expiry: testCard.expiry,
      cvv: testCard.cvv
    });
    cy.contains('PAY NOW').click();

    cy.urlShouldIncludePurchaseSuccess(30000);
    cy.contains('CONGRATULATION').should('be.visible');
    cy.contains('Thank you for your purchase').should('be.visible');
    cy.contains('GO TO DASHBOARD').should('be.visible');
  });

  it('should redirect to dashboard and show purchased product', () => {
    cy.visitDev('/');
    cy.wait(2000);

    cy.contains("FairPlay Unlimited").scrollIntoView();
    cy.wait(1500);
    cy.clickPriceContainingEuros(50);
    cy.wait(500);
    cy.contains('GO TO SECURE CHECKOUT').click();

    cy.url({ timeout: 15000 }).should('include', '/payment');
    cy.wait(2000);

    cy.fillPaymentCardholderName(testCard.name);
    cy.fillPaymentTestCard({
      number: testCard.number,
      expiry: testCard.expiry,
      cvv: testCard.cvv
    });
    cy.contains('PAY NOW').click();

    cy.urlShouldIncludePurchaseSuccess(30000);
    cy.contains('GO TO DASHBOARD').click();

    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    cy.wait(2000);
    cy.contains('ACTIVE PRODUCTS').should('be.visible');
    cy.contains('UNLIMITED OneWorld 7 DAYS').should('be.visible');
  });
});

describe('Complete Purchase Flow - Flex Subscription', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should select 12 Month Flex and navigate to payment page', () => {
    cy.visitDev('/');
    cy.wait(2000);

    cy.contains('FAIRPLAY FLEX').scrollIntoView();
    cy.wait(1500);
    cy.clickPriceContainingEuros(30);
    cy.wait(500);
    cy.contains('PLAY THE MARKET').click();

    cy.url({ timeout: 15000 }).should('include', '/payment');
    cy.wait(2000);

    cy.contains('PAYMENT DETAILS').should('be.visible');
    cy.contains('ORDER SUMMARY').should('be.visible');
  });

  it('should complete Flex payment and see success page', () => {
    cy.visitDev('/');
    cy.wait(2000);

    cy.contains('FAIRPLAY FLEX').scrollIntoView();
    cy.wait(1500);
    cy.clickPriceContainingEuros(30);
    cy.wait(500);
    cy.contains('PLAY THE MARKET').click();

    cy.url({ timeout: 15000 }).should('include', '/payment');
    cy.wait(2000);

    cy.fillPaymentCardholderName('Test User');
    cy.fillPaymentTestCard();
    cy.contains('PAY NOW').click();

    cy.urlShouldIncludePurchaseSuccess(30000);
    cy.contains('CONGRATULATION').should('be.visible');
    cy.contains('Thank you for your purchase').should('be.visible');
  });
});

describe('Cancel Payment', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should cancel payment and return from payment page', () => {
    cy.visitDev('/');
    cy.wait(2000);

    cy.contains("FairPlay Unlimited").scrollIntoView();
    cy.wait(1500);
    cy.clickPriceContainingEuros(50);
    cy.wait(500);
    cy.contains('GO TO SECURE CHECKOUT').click();

    cy.url({ timeout: 15000 }).should('include', '/payment');
    cy.wait(2000);

    cy.contains('CANCEL PAYMENT').click();
    cy.url({ timeout: 10000 }).should('not.include', '/payment');
  });
});
