it("can visit home", () => {
  cy.visit("/");
  cy.contains("The Landing Page");
});
