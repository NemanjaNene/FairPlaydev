describe('Buy Bundles Section', () => {
  beforeEach(() => {
    cy.login();
    cy.visitDev('/dashboard/services/my-products');
    cy.wait(2000);
    cy.contains('BUY BUNDLES', { timeout: 25000 }).scrollIntoView();
    cy.wait(1000);
  });

  it('should display BUY BUNDLES section', () => {
    cy.contains('BUY BUNDLES').should('be.visible');
  });

  it('should display all bundle cards with correct data amounts', () => {
    cy.contains('1 GB').should('exist');
    cy.contains('2 GB').should('exist');
    cy.contains('3 GB').should('exist');
    cy.contains('5 GB').should('exist');
    cy.contains('10 GB').should('exist');
    cy.contains('20 GB').should('exist');
    cy.contains('50 GB').should('exist');
  });

  it('should display correct prices for bundles', () => {
    cy.contains(/€\s*5(?:[^0-9]|$)/).should('exist');
    cy.contains(/€\s*7\.5/).should('exist');
    cy.contains(/€\s*10(?:[^0-9]|$)/).should('exist');
    cy.contains(/€\s*15(?:[^0-9]|$)/).should('exist');
    cy.contains(/€\s*25(?:[^0-9]|$)/).should('exist');
    cy.contains(/€\s*(?:35|45)(?:[^0-9]|$)/).should('exist');
    cy.contains(/€\s*75(?:[^0-9]|$)/).should('exist');
  });

  it('should display validity and auto renewal info', () => {
    cy.contains('30 Days').should('exist');
    cy.contains('1 Month').should('exist');
    cy.contains(/180\s*days|6\s*months/i).should('exist');
    cy.contains('AUTO RENEWAL').should('exist');
  });

  it('should have BUY buttons for all bundles', () => {
    cy.get('button').filter(':contains("BUY")').should('have.length.at.least', 8);
  });
});

describe('Purchase Bundle - Complete Flow', () => {
  it('should buy 1GB bundle and see it on dashboard', () => {
    cy.login();
    cy.visitDev('/dashboard/services/my-products');
    cy.wait(2000);

    cy.contains('BUY BUNDLES', { timeout: 25000 }).scrollIntoView();
    cy.wait(1000);

    cy.contains('1 GB').scrollIntoView();
    cy.contains(/€\s*5(?:[^0-9]|$)/).parent().parent().parent().contains('BUY').click();

    cy.url({ timeout: 15000 }).should('include', '/payment');
    cy.wait(3000);

    cy.contains('PAYMENT DETAILS').should('be.visible');
    cy.contains('ORDER SUMMARY').should('be.visible');

    cy.fillPaymentCardholderName('Test User');
    cy.fillStripeTestCard();

    cy.contains('PAY NOW').click();

    cy.url({ timeout: 30000 }).should((url) => {
      expect(
        url.includes('/dashboard') ||
          url.includes('/successfull-purchase') ||
          url.includes('/successful-purchase')
      ).to.be.true;
    });
    cy.url().then((url) => {
      if (url.includes('success')) {
        cy.contains('GO TO DASHBOARD').click();
        cy.url({ timeout: 15000 }).should('include', '/dashboard');
      }
    });

    cy.wait(2000);

    cy.contains('ACTIVE PRODUCTS').should('be.visible');
    cy.contains(/DATA BUNDLE.*1\s*GB|OneWorld.*1\s*GB/i).should('exist');
  });
});
