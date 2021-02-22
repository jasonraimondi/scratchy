import { simpleParser } from "mailparser";

Cypress.Commands.add("dataTest", tag => cy.get(`[data-test=${tag}]`));

Cypress.Commands.add("verifyUser", email => {
  cy.getLastEmail(email).then(res => {
    const parsedEmail = res.parsedBody.textAsHtml;
    const link = parsedEmail.match(/href="([^"]*)/)[1];
    console.log({link})
    cy.visit(link);
    // cy.location("pathname").should("equal", "/login");
  });
});

Cypress.Commands.add("getLastEmail", email => {
  const url = `${Cypress.env("MAILER_HTTP_URL")}/api/v2/search?kind=to&query=${decodeURIComponent(email)}`;

  const authLog = Cypress.log({
    name: "getLastEmail",
    displayName: "FETCH EMAIL",
    message: [`🔐 ${email}`],
    autoEnd: false,
  });

  function log() {
    authLog.set({
      consoleProps: () => ({
        url,
        email,
      })
    });
    authLog.snapshot("after");
    authLog.end();
  }

  return cy
    .request("GET", url)
    .then(({ body: { items } }) => {
      const lastEmail = items[0];

      expect(lastEmail).not.to.be.undefined;
      console.log({ lastEmail });
      const [to] = lastEmail.Content.Headers.To;
      const [from] = lastEmail.Content.Headers.From;
      const [subject] = lastEmail.Content.Headers.Subject;
      const body = lastEmail.Content.Body;

      return { subject, body, to, from };
    })
    .then(({ subject, body, to, from }) => {
      log();
      return simpleParser(body, {}).then(parsedBody => {
        return {
          subject,
          body,
          parsedBody,
          to,
          from,
        };
      });
    });
});