function emailApiUrl(path) {
  const envValue = Cypress.env("MAILER_HTTP_URL");
  const basePath = envValue ? envValue : Cypress.config("mailHogUrl");
  return `${basePath}/api${path}`;
}

Cypress.Commands.add("emailDeleteAll", () => {
  const authLog = Cypress.log({
    name: "emailDeleteAll",
    displayName: "DELETE EMAIL",
    message: [`🗑 Deleting all emails`],
    autoEnd: false,
  });

  function log() {
    authLog.snapshot("after");
    authLog.end();
  }
  return cy.request("DELETE", emailApiUrl("/v1/messages")).then(() => {
    log();
  });
});

Cypress.Commands.add("emailGetLinksTo", email => {
  return cy.emailGetLastTo(email).then(res => {
    const parsedEmail = res.parsedBody.textAsHtml;
    const link = parsedEmail.match(/href="([^"]*)/)[1];
    return link.replace(/&amp;/g, "&");
  });
});

Cypress.Commands.add("emailGetLastTo", email => {
  const url = emailApiUrl(`/v2/search?kind=to&query=${decodeURIComponent(email)}`);

  const authLog = Cypress.log({
    name: "emailGetLastTo",
    displayName: "FETCH EMAIL",
    message: [`🔐 ${email}`],
    autoEnd: false,
  });

  function log() {
    authLog.set({
      consoleProps: () => ({
        url,
        email,
      }),
    });
    authLog.snapshot("after");
    authLog.end();
  }
  let retries = -1;

  function makeRequest() {
    retries++;
    return cy
      .request("GET", url)
      .then(response => {
        const {
          body: { items },
        } = response;
        const lastEmail = items?.[0];
        try {
          expect(lastEmail).not.to.be.undefined;
        } catch (err) {
          cy.log(`retry attempt ${retries}`);
          if (retries > 5) throw new Error(`retried too many times (${--retries}`);
          cy.wait(150 * Math.pow(2, retries));
          return makeRequest();
        }
        log();
        return lastEmail;
      })
      .then(lastEmail => {
        return cy.task("formatEmailResponse", lastEmail);
      });
  }

  return makeRequest();
});
