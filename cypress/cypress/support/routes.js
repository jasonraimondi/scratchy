const queryMap = {
  "Login": "mutateLogin",
  "Logout": "mutateLogout",
}

beforeEach(() => {
  cy.intercept("POST", "*/graphql", req => {
    const query = req.body.query ?? "";

    for (const [queryName, alias] of Object.entries(queryMap)) {
      if (query.includes(queryName)) {
        req.alias = alias;
      }
    }

    if (!req.alias) {
      req.alias = "graphql";
    }
  });
});
