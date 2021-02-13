import faker from "faker";

Cypress.Cookies.debug(true);

cy.faker = faker;

import "./routes";
import "./auth";
import "./commands";
