describe('Duplicate Purchase Prevention', () => {
  beforeEach(() => {
    cy.login();
    cy.visitDev('/');
    cy.wait(2000);
  });

  it('should show toast error when trying to buy second Unlimited plan', () => {
    cy.contains("FairPlay Unlimited").scrollIntoView();
    cy.wait(1500);
    cy.contains('€ 50').click({ force: true });
    cy.wait(500);
    cy.contains('GO TO SECURE CHECKOUT').click();

    cy.contains(/Another Unlimited plan is currently active|Unlimited.*(already active|currently active)/i, {
      timeout: 15000
    }).should('be.visible');
    cy.url().should('not.include', '/payment');
  });

  it('should show toast error when trying to buy existing Flex subscription - 6 Month', () => {
    cy.contains('FAIRPLAY FLEX').scrollIntoView();
    cy.wait(1500);
    cy.contains('€ 35').click({ force: true });
    cy.wait(500);
    cy.contains('PLAY THE MARKET').click();

    cy.contains('Subscription already exists', { timeout: 10000 }).should('be.visible');
    cy.url().should('not.include', '/payment');
  });

  it('should show toast error when trying to buy existing Flex subscription - 12 Month', () => {
    cy.contains('FAIRPLAY FLEX').scrollIntoView();
    cy.wait(1500);
    cy.contains('€ 30').click({ force: true });
    cy.wait(500);
    cy.contains('PLAY THE MARKET').click();

    cy.contains('Subscription already exists', { timeout: 10000 }).should('be.visible');
    cy.url().should('not.include', '/payment');
  });

  it('should show toast error when trying to buy existing Flex subscription - 24 Month', () => {
    cy.contains('FAIRPLAY FLEX').scrollIntoView();
    cy.wait(1500);
    cy.contains('€ 25').first().click({ force: true });
    cy.wait(500);
    cy.contains('PLAY THE MARKET').click();

    cy.contains('Subscription already exists', { timeout: 10000 }).should('be.visible');
    cy.url().should('not.include', '/payment');
  });
});
