Cypress.Commands.add("dataTest", tag => cy.get(`[data-test=${tag}]`));
