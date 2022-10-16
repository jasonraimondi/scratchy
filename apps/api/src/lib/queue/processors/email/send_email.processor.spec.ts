import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Job } from "bull";

import { QueueWorkerModule } from "~/lib/queue/queue_worker.module";
import { SendEmailProcessor } from "~/lib/queue/processors/email/send_email.processor";
import { createTestingModule, TestingModule } from "~test/app_testing.module";
import { emails } from "~test/mock_email_service";

describe("send_email processor", () => {
  let testingModule: TestingModule;
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
    testingModule = await createTestingModule({ imports: [QueueWorkerModule] });
    resolver = testingModule.container.get(SendEmailProcessor);
  });

  afterAll(async () => {
    await testingModule.container.close();
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
