beforeEach(() => {
  cy.intercept("POST", "/graphql", req => {
    const query = req.body.query ?? "";
    if (query.includes("Login")) {
      req.alias = "mutateLogin";
    } else if (query.includes("Logout")) {
      req.alias = "mutateLogout";
    }
  });
});
