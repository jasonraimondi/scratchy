import { ISendMailOptions } from "@nestjs-modules/mailer";
import { TestingModule } from "@nestjs/testing";
import { Job } from "bull";

import { Permission } from "~/entities/permission.entity";
import { Role } from "~/entities/role.entity";
import { EmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entities/forgot_password.entity";
import { User } from "~/entities/user.entity";
import { QueueWorkerModule } from "~/app/queue_workers/queue_worker.module";
import { SendEmailProcessor } from "~/app/queue_workers/processors/email/send_email.processor";
import { createTestingModule } from "~test/app_testing.module";
import { emails } from "~test/mock_email_service";

describe("send_email processor", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let resolver: SendEmailProcessor;

  const job: Job<ISendMailOptions> | any = {
    progress: jest.fn(),
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
    // moduleRef = await createTestingModule({ providers: [SendEmailProcessor, EmailTemplateService] }, entities);
    moduleRef = await createTestingModule({ imports: [QueueWorkerModule] }, entities);
    resolver = moduleRef.get(SendEmailProcessor);
  });

  afterAll(async () => {
    await moduleRef.close();
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
    await expect(result).rejects.toThrowError(new RegExp("template not found: emails/foo/bar.html.njk"));
    expect(emails.length).toBe(0);
  });
});
