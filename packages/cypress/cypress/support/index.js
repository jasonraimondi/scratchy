import faker from "faker";

Cypress.Cookies.debug(true);

cy.faker = faker;

import "./routes";
import "./email";
import "./auth";
import "./commands";

beforeEach(() => {
  cy.emailDeleteAll();
});
