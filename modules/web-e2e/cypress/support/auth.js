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
  cy.dataTest("login-form").within(() => {
    cy.get("#email").type(email);
    cy.get("#password").type(password);
    if (rememberMe) cy.get("#remember-me").click();
    cy.get("#submit").click();
    cy.wait("@mutateLogin").then(({ request }) => {
      expect(request.body.variables.input.email).to.equal(email);
      expect(request.body.variables.input.password).to.equal(password);
      expect(request.body.variables.input.rememberMe).to.be.equal(rememberMe);
    });
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

  cy.getCookie("a_accessToken")
    .should("exist")
    .then(cookie => {
      const jwt = cookie.value;
      expect(jwt).to.be.a("string");
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
  cy.get(".forgot-password").click();

  cy.dataTest("forgot-password-form").within(() => {
    cy.get("#email").type(email);
    cy.get("#submit").click();
    cy.location("pathname").should("eq", "/");
  });

  cy.emailGetLinksTo(email).then(link => {
    cy.visit(link);
  });

  cy.dataTest("reset-password-form").within(() => {
    cy.get("#password").type(newPassword);
    cy.get("#submit").click();
  });
});

Cypress.Commands.add("verifyUser", email => {
  cy.emailGetLinksTo(email).then(link => {
    cy.visit(link);
  });
});
