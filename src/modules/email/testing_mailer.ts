import { injectable } from "inversify";

import { IMailer, Options } from "~/modules/email/mailer";

@injectable()
export class TestingMailer implements IMailer {
  async send(_options: Options) {
    return true;
  }
}
