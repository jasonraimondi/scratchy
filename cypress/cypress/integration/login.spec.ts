describe("Login Spec", () => {
  let user;

  beforeEach(() => {
    cy.viewport("iphone-x");
    user = { email: "jason@raimondi.us", password: "jasonraimondi", rememberMe: true };
  });

  ["api", "gui"].forEach((method: "api"|"gui") => {
    it(`can login via ${method}`, () => {
      cy.login(user, method);
      cy.logout();
    });
  })


  it("can login where remember me is false", () => {
    user.rememberMe = false;
    cy.login(user);
    cy.logout();
  });
});
