describe('Delete Payment Method', () => {
  beforeEach(() => {
    cy.login();
    cy.visitDev('/dashboard/profile');
    cy.wait(2000);
  });

  it('should show error when trying to delete payment method with active subscription', () => {
    cy.contains('Delete payment method').scrollIntoView();
    cy.wait(500);
    cy.contains('Delete payment method').click();

    cy.contains('This payment method is linked to active subscription and cannot be removed', { timeout: 10000 })
      .should('be.visible');
  });

  it('should keep payment data visible after failed delete attempt', () => {
    cy.contains('Delete payment method').scrollIntoView();
    cy.wait(500);
    cy.contains('Delete payment method').click();

    cy.contains('This payment method is linked to active subscription and cannot be removed', { timeout: 10000 })
      .should('be.visible');

    cy.contains('Card credit').should('be.visible');
    cy.contains('Expiration date').should('be.visible');
    cy.contains('CHANGE PAYMENT METHOD').should('be.visible');
  });
});
