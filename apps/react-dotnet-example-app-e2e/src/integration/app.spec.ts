import { getGreeting } from '../support/app.po';

describe('react-dotnet-example-app', () => {
  beforeEach(() => cy.visit(Cypress.config().baseUrl));

  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Welcome to react-dotnet-example-app!');
  });
});
