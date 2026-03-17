describe('Price Verification', () => {
  beforeEach(() => {
    cy.login();
    cy.visitDev('/');
    cy.wait(2000);
    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(1000);
  });

  context('FairPlay Flex Subscriptions', () => {
    it('should display correct price for 24 Month Subscription', () => {
      cy.contains('24').parent().parent().within(() => {
        cy.contains('25').should('exist');
      });
    });

    it('should display correct price for 12 Month Subscription', () => {
      cy.contains('12').parent().parent().within(() => {
        cy.contains('30').should('exist');
      });
    });

    it('should display correct price for 6 Month Subscription', () => {
      cy.contains('6').parent().parent().within(() => {
        cy.contains('35').should('exist');
      });
    });

    it('should mark 12 Month as MOST POPULAR', () => {
      cy.scrollTo('bottom', { duration: 2000 });
      cy.wait(1000);
      cy.contains('MOST POPULAR').should('exist');
    });
  });

  context('FairPlay Unlimited Day Passes', () => {
    it('should display correct price for 3 Day Pass - €25', () => {
      cy.contains('3').parent().parent().within(() => {
        cy.contains('25').should('exist');
      });
    });

    it('should display correct price for 7 Day Pass - €50', () => {
      cy.contains('7').parent().parent().within(() => {
        cy.contains('50').should('exist');
      });
    });

    it('should display correct price for 14 Day Pass - €75', () => {
      cy.contains('14').parent().parent().within(() => {
        cy.contains('75').should('exist');
      });
    });

    it('should show daily rate for Day Passes', () => {
      cy.contains('8,33').should('exist');
      cy.contains('7,14').should('exist');
      cy.contains('5,36').should('exist');
    });
  });
});
