import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { MailerService } from "@nestjs-modules/mailer";

import { EmailService } from "~/app/email/services/email.service";
import { DatabaseModule } from "~/lib/database/database.module";
import { emails, emailServiceMock } from "./mock_email_service";

const mailerServiceMock = {
  sendMail: jest.fn().mockImplementation((res) => {
    emails.push(res);
  }),
};

const mockQueue = {
  add: jest.fn().mockImplementation(console.log),
};

export async function createTestingModule(metadata: ModuleMetadata = {}) {
  const imports = metadata.imports ?? [];
  metadata = {
    ...metadata,
    imports: [DatabaseModule, ...imports],
    providers: [
      {
        provide: EmailService,
        useValue: emailServiceMock,
      },
      {
        provide: MailerService,
        useValue: mailerServiceMock,
      },
      ...(metadata.providers ?? []),
    ],
  };

  return Test.createTestingModule(metadata)
    .overrideProvider(EmailService)
    .useValue(emailServiceMock)
    .overrideProvider(MailerService)
    .useValue(mailerServiceMock)
    .overrideProvider("BullQueue_email")
    .useValue(mockQueue)
    .compile();
}
