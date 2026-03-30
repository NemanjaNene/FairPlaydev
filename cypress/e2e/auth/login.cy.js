describe('Login Flow', () => {
  beforeEach(() => {
    cy.visitDev('/auth');
    cy.wait(2000);
  });

  it('should display the login page with all elements', () => {
    cy.url().should('include', '/auth');
    cy.get('input[type="email"]').filter(':visible').first().should('be.visible');
    cy.get('input[type="password"]').filter(':visible').first().should('be.visible');
    cy.contains('button', 'LOG IN').should('be.visible');
    cy.contains('Forgot password').should('be.visible');
    cy.contains('NO ACCOUNT YET').should('be.visible');
  });

  it('should login with valid credentials', () => {
    const email = Cypress.env('testUserEmail');
    const password = Cypress.env('testUserPassword');

    cy.get('input[type="email"]').filter(':visible').first().clear().type(email);
    cy.get('input[type="password"]').filter(':visible').first().type(password);
    cy.contains('button', 'LOG IN').click();

    cy.url({ timeout: 15000 }).should('not.include', '/auth');
  });

  it('should show error with invalid credentials', () => {
    cy.get('input[type="email"]').filter(':visible').first().clear().type('invalid@test.com');
    cy.get('input[type="password"]').filter(':visible').first().type('WrongPass123!');
    cy.contains('button', 'LOG IN').click();

    cy.url().should('include', '/auth');
  });
});
