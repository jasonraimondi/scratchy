import { simpleParser } from "mailparser";

function mhApiUrl(path) {
  const envValue = Cypress.env("MAILER_HTTP_URL");
  const basePath = envValue ? envValue : Cypress.config("mailHogUrl");
  return `${basePath}/api${path}`;
}

/**
 * @param response Cypress.Response
 * @returns {Promise<any>}
 */
async function formatEmailResponse(lastEmail) {
  const [to] = lastEmail.Content.Headers.To;
  const [from] = lastEmail.Content.Headers.From;
  const [subject] = lastEmail.Content.Headers.Subject;
  const body = lastEmail.Content.Body;
  const parsedBody = await simpleParser(body, {});
  return { subject, body, to, from, parsedBody };
}

Cypress.Commands.add("mhDeleteAll", () => {
  const authLog = Cypress.log({
    name: "mhDeleteAll",
    displayName: "DELETE EMAIL",
    message: [`🗑 Deleting all emails`],
    autoEnd: false,
  });

  function log() {
    authLog.snapshot("after");
    authLog.end();
  }
  return cy.request("DELETE", mhApiUrl("/v1/messages")).then(() => {
    log();
  });
});

Cypress.Commands.add("mhGetLastEmailTo", email => {
  const url = mhApiUrl(`/v2/search?kind=to&query=${decodeURIComponent(email)}`);

  const authLog = Cypress.log({
    name: "mhGetLastEmailTo",
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
      .then(formatEmailResponse);
  }

  return makeRequest();
});
