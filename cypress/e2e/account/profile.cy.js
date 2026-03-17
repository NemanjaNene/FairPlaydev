describe('Profile Page', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should navigate to profile via homepage → MY PROFILE → PROFILE', () => {
    cy.visitDev('/');
    cy.wait(2000);

    cy.contains('MY PROFILE').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.wait(2000);

    cy.contains('PROFILE').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard/profile');
    cy.wait(2000);

    cy.contains('Hello,').should('be.visible');
  });

  it('should display personal information section', () => {
    cy.visitDev('/dashboard/profile');
    cy.wait(2000);

    cy.contains('PERSONAL INFORMATION').should('be.visible');
    cy.contains('Email').should('be.visible');
    cy.contains('First name').should('be.visible');
    cy.contains('Last name').should('be.visible');
  });

  it('should show correct user email in input field', () => {
    cy.visitDev('/dashboard/profile');
    cy.wait(2000);

    const email = Cypress.env('testUserEmail');
    cy.get('input').filter((i, el) => el.value.includes(email)).should('exist');
  });

  it('should display payment data section', () => {
    cy.visitDev('/dashboard/profile');
    cy.wait(2000);

    cy.contains('PAYMENT DATA').should('be.visible');
    cy.contains('Card credit').should('be.visible');
    cy.contains('Expiration date').should('be.visible');
    cy.contains('CHANGE PAYMENT METHOD').should('be.visible');
    cy.contains('Delete payment method').should('be.visible');
  });

  it('should show CHANGE PAYMENT METHOD button', () => {
    cy.visitDev('/dashboard/profile');
    cy.wait(2000);

    cy.contains('CHANGE PAYMENT METHOD').should('be.visible');
  });

  it('should show Delete payment method option', () => {
    cy.visitDev('/dashboard/profile');
    cy.wait(2000);

    cy.contains('Delete payment method').should('be.visible');
  });

  it('should display order history', () => {
    cy.visitDev('/dashboard/profile');
    cy.wait(2000);

    cy.contains('ORDER HISTORY').should('be.visible');
  });
});
