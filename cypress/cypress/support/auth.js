const query = `
mutation Login($email: String!, $password:String!, $rememberMe:Boolean!) {
    login(data: { email:$email, password:$password, rememberMe:$rememberMe}) {
        accessToken
        user {
            id
            email
            name
        }
    }
}`;

Cypress.Commands.add("login", ({ email, password, rememberMe = true }, method = "api") => {
  Cypress.log({
    name: "login",
    displayName: "LOGIN",
    message: [`🔐 ${method.toUpperCase()} ${email} ${password}`],
    consoleProps: () => ({ email, password, rememberMe, method }),
  });

  cy.visit("/login");
  cy.getCookie("jid").should("not.exist");
  cy.getCookie("rememberMe").should("not.exist");

  if (method === "gui") {
    cy.dataTest("login-form--email").type(email);
    cy.dataTest("login-form--password").type(password);
    if (rememberMe) cy.dataTest("login-form--remember").click();
    cy.dataTest("login-form--submit").click();
    cy.wait("@mutateLogin").then(({ request }) => {
      expect(request.body.variables.data.email).to.equal(email);
      expect(request.body.variables.data.password).to.equal(password);
      expect(request.body.variables.data.rememberMe).to.be.equal(rememberMe);
    });
  } else if (method === "api") {
    cy.request({
      method: "POST",
      url: `${Cypress.env("API_URL")}/graphql`, // graphql endpoint
      body: {
        query,
        variables: { email, password, rememberMe },
      },
      failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
    }).then(res => {
      cy.log(res);
    });
  }

  cy.getCookie("jid")
    .should("exist")
    .then(cookie => {
      const jwt = cookie.value;
      const jwtParts = jwt?.split(".");
      expect(jwt).to.be.a("string");
      expect(jwtParts).to.have.length(3);
    });
  cy.getCookie("rememberMe").should("have.property", "value", rememberMe.toString());
});

Cypress.Commands.add("logout", () => {
  cy.visit("/logout");
  cy.wait("@mutateLogout");
  cy.location("pathname").should("equal", "/login");
  cy.getCookie("jid").should("not.exist");
  cy.getCookie("rememberMe").should("not.exist");
});
