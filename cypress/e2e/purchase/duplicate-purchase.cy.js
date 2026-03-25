describe('Duplicate Purchase Prevention', () => {
  beforeEach(() => {
    cy.login();
    cy.visitDev('/');
    cy.wait(2000);
  });

  it('should show toast error when trying to buy second Unlimited plan', () => {
    cy.contains(/FairPlay Unlimited/i).scrollIntoView();
    cy.wait(1000);
    cy.contains(/FairPlay Unlimited/i).then(($heading) => {
      const $section = Cypress.$($heading).closest('section, main');
      if ($section.length) {
        cy.wrap($section).within(() => {
          cy.clickPriceContainingEuros(50);
          cy.contains('GO TO SECURE CHECKOUT').click();
        });
      } else {
        cy.clickPriceContainingEuros(50);
        cy.contains('GO TO SECURE CHECKOUT').click();
      }
    });

    cy.get('body', { timeout: 20000 }).should(($body) => {
      expect($body.text()).to.match(/Another Unlimited plan is currently active/i);
    });
    cy.url().should('not.include', '/payment');
  });

  it('should show toast error when trying to buy existing Flex subscription - 6 Month', () => {
    cy.contains('FAIRPLAY FLEX').scrollIntoView();
    cy.wait(1500);
    cy.clickPriceContainingEuros(35);
    cy.wait(500);
    cy.contains('PLAY THE MARKET').click();

    cy.contains('Subscription already exists', { timeout: 10000 }).should('be.visible');
    cy.url().should('not.include', '/payment');
  });

  it('should show toast error when trying to buy existing Flex subscription - 12 Month', () => {
    cy.contains('FAIRPLAY FLEX').scrollIntoView();
    cy.wait(1500);
    cy.clickPriceContainingEuros(30);
    cy.wait(500);
    cy.contains('PLAY THE MARKET').click();

    cy.contains('Subscription already exists', { timeout: 10000 }).should('be.visible');
    cy.url().should('not.include', '/payment');
  });

  it('should show toast error when trying to buy existing Flex subscription - 24 Month', () => {
    cy.contains('FAIRPLAY FLEX').scrollIntoView();
    cy.wait(1500);
    cy.clickPriceContainingEuros(25, { first: true });
    cy.wait(500);
    cy.contains('PLAY THE MARKET').click();

    cy.contains('Subscription already exists', { timeout: 10000 }).should('be.visible');
    cy.url().should('not.include', '/payment');
  });
});
