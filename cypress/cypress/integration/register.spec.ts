type RegisterData = {
  email: string;
  password?: string;
  first?: string;
  last?: string;
}

describe("user registration flow", () => {
  const first = cy.faker.name.firstName();
  const last = cy.faker.name.lastName();
  const email = cy.faker.internet.email(first, last, "example.com");
  const password = "Password123!";

  it.only("user can register, verify email, and successfully login", () => {
    register({ email, first, last, password });
    cy.verifyUser(email);
    // cy.login({ email, password });
  });

  it("user can register with only email and password", () => {
    const email = cy.faker.internet.email();
    register({ email, password });
    cy.verifyUser(email);

  });

  it("user can register with only email", () => {
    const email = cy.faker.internet.email();
    register({ email });
    cy.verifyUser(email);
  });

  function register({ email, password, first, last }: RegisterData) {
    cy.visit("/register");

    cy.dataTest("register-form").within(() => {
      cy.dataTest("register-form--email").click().type(email);

      if (password) cy.dataTest("register-form--password").click().type(password);
      if (first) cy.dataTest("register-form--first").click().type(first);
      if (last) cy.dataTest("register-form--last").click().type(last);
    });

    cy.dataTest("register-form").submit();

    cy.location('pathname').should("equal", "/register/success");
  }

  function assertUserIsNotVerified({ email, password }: { email: string; password: string }) {
    cy.visit("/login?redirectTo=/dashboard");
    cy.dataTest("login-form").within(() => {
      cy.dataTest("email").type(email);
      cy.dataTest("password").type(password);
      cy.dataTest("submit").click();
    });
    cy.wait("@mutateLogin").then(({ request }) => {
      expect(request.body.variables.data.email).to.equal(email);
      expect(request.body.variables.data.password).to.equal(password);
    });
    cy.contains("user is not active");
  }
});