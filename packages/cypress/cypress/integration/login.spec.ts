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

    cy.dataTest("login-form--submit").click();
    cy.contains("password must be at least 8 characters");
    cy.contains("email is a required field");

    cy.dataTest("login-form--password").type("jasonraimondi");
    cy.dataTest("login-form--submit").click();
    cy.contains("email is a required field");
    cy.contains("password must be at least 8 characters").should("not.exist");
  });

  it.skip("can trigger forgot password", function () {
    const email = "jason@raimondi.us";
    const password = "jasonraimondi";
    const newPassword = "abc123";
    cy.resetPassword(email, newPassword);
    cy.login({ email: email, password: newPassword });
    cy.logout();
    cy.emailDeleteAll();
    cy.resetPassword(email, password);
    cy.login({ email: email, password: password });
    cy.logout();
  });
});
