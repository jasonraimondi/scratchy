describe("Profile Spec", () => {
  const user = { email: "jason@raimondi.us", password: "jasonraimondi" };

  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.login(user);
  });

  it("can revoke the refresh token", () => {
    cy.visit("/app/settings");
    cy.wait("@queryMe");
    cy.dataTest("revoke-refresh-token").click();
  });
});
