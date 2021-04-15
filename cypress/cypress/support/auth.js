const loginQuery = `
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

  // if (method === "gui") {
  cy.dataTest("login-form--email").type(email);
  cy.dataTest("login-form--password").type(password);
  if (rememberMe) cy.dataTest("login-form--remember").click();
  cy.dataTest("login-form--submit").click();
  cy.wait("@mutateLogin").then(({ request }) => {
    expect(request.body.variables.data.email).to.equal(email);
    expect(request.body.variables.data.password).to.equal(password);
    expect(request.body.variables.data.rememberMe).to.be.equal(rememberMe);
  });
  // } else if (method === "api") {
  //   cy.request({
  //     method: "POST",
  //     url: `${Cypress.env("API_URL")}/graphql`, // graphql endpoint
  //     body: { query: loginQuery, variables: { email, password, rememberMe }, },
  //     failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
  //   }).then(res => {
  //     cy.log(res.body);
  //   });
  //   cy.visit("/");
  // }

  cy.getCookie("jid")
    .should("exist")
    .then(cookie => {
      const jwt = cookie.value;
      const jwtParts = jwt?.split(".");
      expect(jwt).to.be.a("string");
      expect(jwtParts).to.have.length(3);
    });
});

Cypress.Commands.add("logout", () => {
  cy.visit("/logout");
  cy.wait("@mutateLogout");
  cy.location("pathname").should("equal", "/login");
  cy.getCookie("jid").should("not.exist");
});

Cypress.Commands.add("resetPassword", (email, newPassword) => {
  cy.visit("/login");
  cy.dataTest("forgot-password-link").click();
  cy.dataTest("forgot-password-form--email").type(email);
  cy.dataTest("forgot-password-form--submit").click();
  cy.location("pathname").should("eq", "/");
  cy.emailGetLinksTo(email).then(link => {
    cy.visit(link);
  });
  cy.dataTest("reset-password-form--password").type(newPassword);
  cy.dataTest("reset-password-form--submit").click();
});

Cypress.Commands.add("verifyUser", email => {
  cy.emailGetLinksTo(email).then(link => {
    cy.visit(link);
  });
});
