describe('Login Flow', () => {
  beforeEach(() => {
    cy.visitDev('/auth');
    cy.wait(2000);
  });

  it('should display the login page with all elements', () => {
    cy.url().should('include', '/auth');
    cy.get('#email').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains('button', 'LOG IN').should('be.visible');
    cy.contains('Forgot password').should('be.visible');
    cy.contains('NO ACCOUNT YET').should('be.visible');
  });

  it('should login with valid credentials', () => {
    const email = Cypress.env('testUserEmail');
    const password = Cypress.env('testUserPassword');

    cy.get('#email').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains('button', 'LOG IN').click();

    cy.url({ timeout: 15000 }).should('not.include', '/auth');
  });

  it('should show error with invalid credentials', () => {
    cy.get('#email').type('invalid@test.com');
    cy.get('input[type="password"]').type('WrongPass123!');
    cy.contains('button', 'LOG IN').click();

    cy.url().should('include', '/auth');
  });
});
