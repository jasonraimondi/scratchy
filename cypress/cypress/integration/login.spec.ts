describe("Login Spec", () => {
  let user = { email: "jason@raimondi.us", password: "jasonraimondi", rememberMe: true };

  beforeEach(() => {
    cy.viewport("iphone-x");
  });

  it(`can login via api`, () => {
    cy.login(user, "api");
    // cy.logout();
  });

  it(`can login via gui`, () => {
    cy.login(user, "gui");
    cy.logout();
  });

  it("can login where remember me is false", () => {
    user.rememberMe = false;
    cy.login(user);
    // cy.logout();
  });

  it.skip("can trigger forgot password", function () {
    cy.visit("/login");
    cy.dataTest("forgot-password-link").click();
    cy.dataTest("forgot-password-form--email").type("jason@raimondi.us");
    cy.dataTest("forgot-password-form--submit").click();
    cy.location("pathname").should("eq", "/");

    cy.mhGetLastEmailTo(user.email).then(res => {
      const parsedEmail = res.parsedBody.textAsHtml;
      const link = parsedEmail.match(/href="([^"]*)/)[1].replace(/&amp;/g, "&");
      console.log({ link });
      cy.visit(link);
    });
    cy.dataTest("reset-password-form--password").type("newpasswordone1234");
    cy.dataTest("reset-password-form--submit").click();
  });
});
