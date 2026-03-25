describe('Purchase Flow', () => {
  beforeEach(() => {
    cy.login();
    cy.visitDev('/');
    cy.wait(2000);
  });

  context('Day Pass Purchase', () => {
    beforeEach(() => {
      cy.contains("FairPlay Unlimited").scrollIntoView();
      cy.wait(1500);
    });

    it('should show checkout button when selecting 7 Day Pass', () => {
      cy.clickPriceContainingEuros(50);
      cy.wait(500);
      cy.contains('GO TO SECURE CHECKOUT').should('exist');
    });

    it('should show checkout button when selecting 3 Day Pass', () => {
      cy.contains('8,33').click({ force: true });
      cy.wait(500);
      cy.contains('GO TO SECURE CHECKOUT').should('exist');
    });

    it('should show checkout button when selecting 14 Day Pass', () => {
      cy.clickPriceContainingEuros(75);
      cy.wait(500);
      cy.contains('GO TO SECURE CHECKOUT').should('exist');
    });
  });

  context('Flex Subscription Purchase', () => {
    beforeEach(() => {
      cy.contains('FAIRPLAY FLEX').scrollIntoView();
      cy.wait(1500);
    });

    it('should show checkout button when selecting 12 Month Flex', () => {
      cy.clickPriceContainingEuros(30);
      cy.wait(500);
      cy.contains('PLAY THE MARKET').should('exist');
    });

    it('should show checkout button when selecting 24 Month Flex', () => {
      cy.clickPriceContainingEuros(25, { first: true });
      cy.wait(500);
      cy.contains('PLAY THE MARKET').should('exist');
    });

    it('should show checkout button when selecting 6 Month Flex', () => {
      cy.clickPriceContainingEuros(35);
      cy.wait(500);
      cy.contains('PLAY THE MARKET').should('exist');
    });
  });
});
