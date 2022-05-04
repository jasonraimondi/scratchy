type RegisterData = {
  email: string;
  password?: string;
  nickname?: string;
};

describe("user registration flow", () => {
  const nickname = cy.falso.randUserName();
  const email = cy.falso.randEmail({ provider: "example" });
  const password = "Password123!";

  it("user can register, verify email, and successfully login", () => {
    register({ email, nickname, password });
    cy.verifyUser(email);
    // cy.login({ email, password }, "gui");
  });

  // it("user can register with only email and password", () => {
  //   const email = cy.faker.internet.email();
  //   register({ email, password });
  //   cy.verifyUser(email);
  //
  // });
  //
  // it("user can register with only email", () => {
  //   const email = cy.faker.internet.email();
  //   register({ email });
  //   cy.verifyUser(email);
  // });

  function register({ email, password, nickname }: RegisterData) {
    cy.visit("/register");

    cy.dataTest("register-form").within(() => {
      cy.get("#email").click().type(email);

      if (password) cy.get("#password").click().type(password);
      if (nickname) cy.get("#nickname").click().type(nickname);
    });

    cy.dataTest("register-form").submit();

    cy.location("pathname").should("equal", "/register/success");
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
