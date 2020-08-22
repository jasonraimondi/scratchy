import { ServiceFactory } from "~/lib/services/service_factory";
import { TestingMailer } from "~/lib/services/email/testing_mailer";

export class TestingServiceFactory extends ServiceFactory {
  get emailService() {
    return new TestingMailer();
  }
}
