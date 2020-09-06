import produce from "immer";
import { createConnection } from "typeorm";
import { v4 } from "uuid";
import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { MailerService } from "@nestjs-modules/mailer";

import { EmailService } from "~/lib/emails/services/email.service";
import { RepositoryModule } from "~/lib/repositories/repository.module";
import { emails, emailServiceMock } from "./mock_email_service";

const mailerServiceMock = {
  sendMail: jest.fn().mockImplementation((res) => {
    emails.push(res);
  }),
};

const mockQueue = {
  add: jest.fn().mockImplementation(console.log),
};

export async function createTestingModule(metadata: ModuleMetadata, entities: any[] = [], logging = false) {
  const tester = produce(metadata, (draft: ModuleMetadata) => {
    draft.imports = draft.imports ?? [];
    draft.providers = draft.providers ?? [];

    draft.imports.push(RepositoryModule);

    draft.providers.push(
      {
        provide: EmailService,
        useValue: emailServiceMock,
      },
      {
        provide: MailerService,
        useValue: mailerServiceMock,
      },
    );
  });

  return Test.createTestingModule(tester)
    .overrideProvider("DATABASE_CONNECTION")
    .useFactory({
      factory: async () =>
        await createConnection({
          name: v4(),
          type: "sqlite",
          database: ":memory:",
          logging,
          synchronize: entities.length > 0,
          entities,
        }),
    })
    .overrideProvider(EmailService)
    .useValue(emailServiceMock)
    .overrideProvider(MailerService)
    .useValue(mailerServiceMock)
    .overrideProvider("BullQueue_email")
    .useValue(mockQueue)
    .compile();
}
