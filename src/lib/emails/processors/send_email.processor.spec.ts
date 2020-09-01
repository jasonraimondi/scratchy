import { Role } from "~/entity/role/role_entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import { TestingModule } from "@nestjs/testing";
import { User } from "~/entity/user/user_entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";
import { Permission } from "~/entity/role/permission_entity";
import { createTestingModule } from "~/app/app_testing.module";
import { SendEmailProcessor } from "~/lib/emails/processors/send_email.processor";
import { EmailTemplateService } from "~/lib/emails/services/email_template.service";
import { Job } from "bull";
import { ISendMailOptions } from "@nestjs-modules/mailer";
import { emails } from "~test/mock_email_service";

describe("send_email processor", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let resolver: SendEmailProcessor;

  const job: Job<ISendMailOptions> | any = {
    data: {
      to: "jason1@raimondi.us",
      subject: "Forgot your password?",
      template: "test/hello-world",
      context: {
        name: "World",
      },
    },
  };

  beforeAll(async () => {
    container = await createTestingModule({ providers: [SendEmailProcessor, EmailTemplateService] }, entities);
    resolver = container.get(SendEmailProcessor);
  });

  it("sends email for valid job data", async () => {
    const result = resolver.handleSend(job);
    await expect(result).resolves.toBeUndefined();
    expect(emails.length).toBe(1);
    expect(emails[0].to).toBe(job.data.to);
    expect(emails[0].subject).toBe(job.data.subject);
    expect(emails[0].html).toBe("<p>Hello World</p>");
    expect(emails[0].text).toBe("Hello World");
  });

  it("throws error when template not found", async () => {
    job.data.template = "foo/bar";
    const result = resolver.handleSend(job);
    await expect(result).rejects.toThrowError(new RegExp("no such file or directory"));
    expect(emails.length).toBe(0);
  });
});
