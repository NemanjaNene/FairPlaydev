describe('Buy Bundles Section', () => {
  beforeEach(() => {
    cy.login();
    cy.visitDev('/dashboard/services/my-products');
    cy.wait(2000);
    cy.contains('BUY BUNDLES').scrollIntoView();
    cy.wait(1000);
  });

  it('should display BUY BUNDLES section', () => {
    cy.contains('BUY BUNDLES').should('be.visible');
  });

  it('should display all bundle cards with correct data amounts', () => {
    cy.contains('1 GB').should('exist');
    cy.contains('3 GB').should('exist');
    cy.contains('5 GB').should('exist');
    cy.contains('10 GB').should('exist');
    cy.contains('20 GB').should('exist');
    cy.contains('50 GB').should('exist');
  });

  it('should display correct prices for bundles', () => {
    cy.contains('€15').should('exist');
    cy.contains('€25').should('exist');
    cy.contains('€35').should('exist');
    cy.contains('€45').should('exist');
    cy.contains('€55').should('exist');
    cy.contains('€90').should('exist');
  });

  it('should display validity and auto renewal info', () => {
    cy.contains('180 Days').should('exist');
    cy.contains('1 Month').should('exist');
    cy.contains('AUTO RENEWAL').should('exist');
  });

  it('should have BUY buttons for all bundles', () => {
    cy.get('button').filter(':contains("BUY")').should('have.length.at.least', 7);
  });
});

describe('Purchase Bundle - Complete Flow', () => {
  it('should buy 1GB bundle and see it on dashboard', () => {
    cy.login();
    cy.visitDev('/dashboard/services/my-products');
    cy.wait(2000);

    cy.contains('BUY BUNDLES').scrollIntoView();
    cy.wait(1000);

    cy.contains('€15').parent().parent().parent().contains('BUY').click();

    cy.url({ timeout: 15000 }).should('include', '/payment');
    cy.wait(3000);

    cy.contains('PAYMENT DETAILS').should('be.visible');
    cy.contains('ORDER SUMMARY').should('be.visible');

    cy.contains('Name and Surname of card holder').parent().find('input').clear().type('Test User');
    cy.wait(500);

    cy.contains('PAY NOW').click();

    cy.url({ timeout: 30000 }).should('include', '/dashboard');
    cy.wait(2000);

    cy.contains('ACTIVE PRODUCTS').should('be.visible');
    cy.contains('OneWorld DATA BUNDLE 1 GB').should('exist');
  });
});
