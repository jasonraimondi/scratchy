import { generateUser } from "../../../api/test/generators/generateUser";

describe("Login Spec", () => {
  let user = { email: "jason@raimondi.us", password: "jasonraimondi", rememberMe: true };

  beforeEach(() => {
    cy.viewport("iphone-x");
  });

  it(`can login via gui`, () => {
    cy.login(user, "gui");
    cy.logout();
  });

  it("can login where remember me is false", () => {
    user.rememberMe = false;
    cy.login(user);
    cy.logout();
  });

  it("shows error fields", () => {
    cy.visit("/login");

    cy.dataTest("login-form").within(() => {
      cy.get("#submit").click();
      cy.contains(`"email" is not allowed to be empty`);
      cy.contains(`"password" is not allowed to be empty`);

      cy.get("#email").type("jason@raimondi.us");
      cy.get("#password").type("jason");
      cy.get("#submit").click();
      cy.contains("Should have a minimum length of 8");
    });
  });

  it("can trigger forgot password", function () {
    const email = "jason@raimondi.us";
    const password = "jasonraimondi";
    const newPassword = "abc1234567890";
    cy.resetPassword(email, newPassword);
    cy.login({ email: email, password: newPassword });
    cy.logout();
    cy.emailDeleteAll();
    cy.resetPassword(email, password);
    cy.login({ email: email, password: password });
    cy.logout();
  });
});
