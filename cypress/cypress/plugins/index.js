const { simpleParser } = require("mailparser");

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on("task", {
    formatEmailResponse(lastEmail) {
      const [to] = lastEmail.Content.Headers.To;
      const [from] = lastEmail.Content.Headers.From;
      const [subject] = lastEmail.Content.Headers.Subject;
      const body = lastEmail.Content.Body;
      return simpleParser(body, {}).then(parsedBody => {
        return { subject, body, to, from, parsedBody };
      });
    },
  });
};
