import produce from "immer";
import { createConnection } from "typeorm";
import { v4 } from "uuid";
import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";

import { emails, emailServiceMock } from "./mock_email_service";

import { databaseProviders } from "../src/lib/repositories/repository.providers";
import { EmailService } from "../src/lib/emails/services/email.service";
import { MailerService } from "@nestjs-modules/mailer";

const mailerServiceMock = {
  sendMail: jest.fn().mockImplementation((res) => {
    emails.push(res);
  }),
};

export async function createTestingModule(metadata: ModuleMetadata, entities: any[] = [], logging = false) {
  const repositoryProviders = [
    {
      provide: "DATABASE_CONNECTION",
      useFactory: async () =>
        await createConnection({
          name: v4(),
          type: "sqlite",
          database: ":memory:",
          logging,
          synchronize: entities.length > 0,
          entities,
        }),
    },
    ...databaseProviders,
  ];

  const tester = produce(metadata, (draft: ModuleMetadata) => {
    draft.providers = draft.providers ?? [];
    draft.providers.push({
      provide: EmailService,
      useValue: emailServiceMock,
    });
    draft.providers.push({
      provide: MailerService,
      useValue: mailerServiceMock,
    });
    draft.providers.push(...repositoryProviders);
  });

  return Test.createTestingModule(tester).compile();
}
