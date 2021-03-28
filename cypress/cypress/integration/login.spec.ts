import * as querystring from "querystring";

describe("Login Spec", () => {
  let user;

  beforeEach(() => {
    cy.viewport("iphone-x");
    user = { email: "jason@raimondi.us", password: "jasonraimondi", rememberMe: true };
  });

  ["api", "gui"].forEach((method: "api" | "gui") => {
    it(`can login via ${method}`, () => {
      cy.login(user, method);
      cy.logout();
    });
  });

  it("can login where remember me is false", () => {
    user.rememberMe = false;
    cy.login(user);
    cy.logout();
  });

  it.only("can trigger forgot password", function () {
    cy.visit("/login");
    cy.dataTest("forgot-password-link").click();
    cy.dataTest("forgot-password-form--email").click().clear().type("jason@raimondi.us");
    // cy.dataTest("forgot-password-form--submit").click();
    // cy.location("pathname").should("eq", "/");

    // cy.getLastEmail(user.email).then(res => {
    //   const parsedEmail = res.parsedBody.textAsHtml;
    //   const link = parsedEmail.match(/href="([^"]*)/)[1].replace(/&amp;/g, "&");
    //   console.log({ link });
    //   cy.visit(link);
    // })
    // cy.dataTest('reset-password-form--password').click().clear().type('newpasswordone1234');
    // cy.dataTest('reset-password-form--submit').click();
  });
});
