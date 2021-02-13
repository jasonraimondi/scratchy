describe("Login Spec", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
  });

  it("can login without remember me", () => {
    const user = {
      email: "jason@raimondi.us",
      password: "jasonraimondi",
      rememberMe: true,
    }
    cy.login(user);
    cy.logout();
  });

  it("can login with remember me", () => {
    const user = {
      email: "jason@raimondi.us",
      password: "jasonraimondi",
      rememberMe: false,
    }
    cy.login(user);
    cy.logout();
  });
});
