import faker from 'faker';

Cypress.Cookies.debug(true);

cy.faker = faker;

import './commands'
