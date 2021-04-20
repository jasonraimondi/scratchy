it("can visit home", () => {
  cy.visit("/");
  cy.contains("A Visual Type Scale");
});
