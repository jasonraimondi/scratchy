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
    falso: typeof import("@ngneat/falso");

    dataTest(value: string): Chainable<Element>;

    logout(): Chainable<void>;
    login(data: LoginData, method?: "api" | "gui"): Chainable<void>;
    register(data: RegisterData): Chainable<void>;
    verifyUser(email: string): Chainable<void>;
    resetPassword(email: string, newPassword: string): Chainable<void>;

    emailDeleteAll(): Chainable<void>;
    emailGetLinksTo(email: string): Chainable<string>;
    emailGetLastTo(email: string): Chainable<ParsedEmail>;
  }
}
