Cypress.Commands.add("login", ({ email, password, rememberMe = true }) => {
  cy.visit("/login");
  cy.getCookie("jid").should("not.exist");
  cy.getCookie("rememberMe").should("not.exist");
  cy.dataTest("reset-password-form").within(() => {
    cy.dataTest("email").type(email);
    cy.dataTest("password").type(password);
    if (rememberMe) cy.dataTest("remember-me").click();
    cy.dataTest("submit").click();
  });
  cy.wait("@mutateLogin").then(({ request }) => {
    expect(request.body.variables.data.email).to.equal(email);
    expect(request.body.variables.data.password).to.equal(password);
    expect(request.body.variables.data.rememberMe).to.be.equal(rememberMe);
  });
  cy.getCookie("jid").should("exist")
    .then(cookie => {
      const jwt = cookie.value;
      const jwtParts = jwt.split(".");
      expect(jwt).to.be.a("string");
      expect(jwtParts).to.have.length(3);
    });
  cy.getCookie("rememberMe").should("have.property", "value", rememberMe.toString());
});

Cypress.Commands.add("logout", () => {
  cy.visit("/logout");
  cy.wait("@mutateLogin");
  cy.location("pathname").should("equal", "/login");
  cy.getCookie("jid").should("not.exist");
  cy.getCookie("rememberMe").should("not.exist");
});
