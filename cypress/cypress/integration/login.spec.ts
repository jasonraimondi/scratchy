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
