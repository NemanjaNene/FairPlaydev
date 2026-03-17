describe('Flex Product Start/Stop', () => {
  beforeEach(() => {
    cy.login();
    cy.visitDev('/dashboard/services/my-products');
    cy.wait(2000);
  });

  it('should display Flex products in collapsed state', () => {
    cy.contains('ACTIVE PRODUCTS').should('be.visible');
    cy.contains('FAIRPLAY FLEX').should('exist');
  });

  it('should expand Flex product card and show details', () => {
    cy.contains('FAIRPLAY FLEX').first().click();
    cy.wait(1000);

    cy.contains('Billing Cycle').should('be.visible');
    cy.contains('Coverage').should('be.visible');
    cy.contains('185+ DESTINATIONS').should('be.visible');
    cy.contains('Contract end date').should('be.visible');
  });

  it('should click STOP and toggle to START', () => {
    cy.contains('FAIRPLAY FLEX').first().click();
    cy.wait(1000);

    cy.contains('button', 'STOP').scrollIntoView();
    cy.wait(500);
    cy.contains('button', 'STOP').click();
    cy.wait(2000);

    cy.contains('button', 'START', { timeout: 10000 }).should('be.visible');
  });

  it('should click START and toggle back to STOP', () => {
    cy.contains('FAIRPLAY FLEX').first().click();
    cy.wait(1000);

    cy.contains('button', 'START').scrollIntoView();
    cy.wait(500);
    cy.contains('button', 'START').click();
    cy.wait(2000);

    cy.contains('button', 'STOP', { timeout: 10000 }).should('be.visible');
  });

  it('should complete full STOP → START cycle', () => {
    cy.contains('FAIRPLAY FLEX').first().click();
    cy.wait(1000);

    cy.contains('button', 'STOP').scrollIntoView();
    cy.wait(500);
    cy.contains('button', 'STOP').click();
    cy.wait(2000);

    cy.contains('button', 'START', { timeout: 10000 }).should('be.visible');

    cy.contains('button', 'START').click();
    cy.wait(2000);

    cy.contains('button', 'STOP', { timeout: 10000 }).should('be.visible');
  });
});
