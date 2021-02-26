type ParsedEmail = {
  body: string;
  parsedBody: { textAsHtml: string };
  subject: string;
  to: string;
  from: string;
};

type LoginData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

declare namespace Cypress {
  interface Chainable {
    faker: typeof import("faker");

    dataTest(value: string): Chainable<Element>;

    logout(): Chainable<void>;
    login(data: LoginData, method?: "api" | "gui"): Chainable<void>;
    register(data: RegisterData): Chainable<void>;
    verifyUser(email: string): Chainable<void>;

    getLastEmail(value: string): Chainable<ParsedEmail>;
  }
}
