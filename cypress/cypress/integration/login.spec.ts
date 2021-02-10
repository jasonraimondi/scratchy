it("responds with access token and refresh token cookie", () => {
  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.query?.includes('Login')) {
      req.alias = 'mutateLogin';
    }
  });

  cy.viewport("iphone-x");
  cy.visit("/login");
  cy.getCookie("jid").should("not.exist");
  cy.getCookie("rememberMe").should("not.exist");
  cy.dataTest("reset-password-form").within(() => {
    cy.dataTest("email").type("jason@raimondi.us");
    cy.dataTest("password").type("jasonraimondi");
    cy.dataTest("remember-me").click();
    cy.dataTest("submit").click();
  });
  cy.wait("@mutateLogin")
  cy.getCookies();
  cy.getCookie("jid").should("exist")
    .then(cookie => {
      const jwt = cookie.value;
      const jwtParts = jwt.split(".");
      expect(jwt).to.be.a("string");
      expect(jwtParts).to.have.length(3);
    });
  cy.getCookie("rememberMe").should("have.property", "value", "true");

  cy.location("pathname").should("equal", "/app/dashboard");
  cy.contains("Logout").click();
  cy.contains("Logging Out...");
  cy.location("pathname").should("equal", "/login");
  cy.dataTest("login-link").should("exist");
  cy.getCookie("jid").should("not.exist");
  cy.getCookie("rememberMe").should("not.exist");
});
