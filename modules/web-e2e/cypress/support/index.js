Cypress.Cookies.debug(true);

import * as falso from "@ngneat/falso";

import "./routes";
import "./email";
import "./auth";
import "./commands";

cy.falso = falso;

beforeEach(() => {
  cy.emailDeleteAll();
});
