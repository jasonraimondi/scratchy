import { injectable } from "inversify";

import { IMailer, Options } from "~/lib/services/email/mailer";

@injectable()
export class TestingMailer implements IMailer {
  async send(_options: Options) {
    return true;
  }
}
