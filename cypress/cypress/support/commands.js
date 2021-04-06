Cypress.Commands.add("dataTest", tag => cy.get(`[data-test=${tag}]`));

Cypress.Commands.add("verifyUser", email => {
  cy.mhGetLastEmailTo(email).then(res => {
    const parsedEmail = res.parsedBody.textAsHtml;
    const link = parsedEmail.match(/href="([^"]*)/)[1];
    console.log({ link });
    cy.visit(link);
    // cy.location("pathname").should("equal", "/login");
  });
});
