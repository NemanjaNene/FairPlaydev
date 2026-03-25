describe('Product Browsing', () => {
  beforeEach(() => {
    cy.login();
    cy.visitDev('/dashboard/services/my-products');
    cy.wait(2000);
  });

  it('should show active products after login', () => {
    cy.contains('ACTIVE PRODUCTS').should('be.visible');
    cy.contains('FAIRPLAY FLEX').should('be.visible');
  });

  it('should navigate to homepage by clicking FairPlay logo', () => {
    cy.get('a[href="/"]').first().click();
    cy.wait(2000);

    cy.contains('FREQUENT TRAVELLERS').should('be.visible');
    cy.contains('DAY PASSES').should('be.visible');
    cy.contains('COVERAGE').should('be.visible');
    cy.contains('MY PROFILE').should('be.visible');
  });

  it('should display Flex subscription plans on homepage', () => {
    cy.visitDev('/');
    cy.wait(2000);

    cy.contains('FREQUENT TRAVELLERS').scrollIntoView();
    cy.wait(500);

    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(1000);

    cy.containsEuroPrice(25);
    cy.containsEuroPrice(30);
    cy.containsEuroPrice(35);
    cy.contains('24').should('exist');
    cy.contains('12').should('exist');
    cy.contains('6').should('exist');
  });

  it('should display Day Pass plans on homepage', () => {
    cy.visitDev('/');
    cy.wait(2000);

    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(1000);

    cy.contains('3').should('exist');
    cy.contains('7').should('exist');
    cy.contains('14').should('exist');
    cy.contains('DAYS').should('exist');
  });
});
