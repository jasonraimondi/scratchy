beforeEach(() => {
  cy.intercept("POST", "/graphql", req => {
    // if (req.body.operationName?.includes("Login")) {
    //   req.alias = "mutateLogin";
    // } else if (req.body.operationName?.includes("Logout")) {
    //   req.alias = "mutateLogout";
    // } else {
      req.alias = "api-graphql"
    // }
  });
});
