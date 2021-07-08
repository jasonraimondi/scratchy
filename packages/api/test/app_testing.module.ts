import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { MailerService } from "@nestjs-modules/mailer";
import { PrismaClient } from "@prisma/client";
import { mockDeep, MockProxy } from "jest-mock-extended";

import { EmailService } from "~/lib/email/services/email.service";
import { emails, emailServiceMock } from "./mock_email_service";
import { PrismaService } from "~/lib/database/prisma.service";
import { DatabaseModule } from "~/lib/database/database.module";
import { TestingModule as NestTestingModule } from "@nestjs/testing/testing-module";

const mailerServiceMock = {
  sendMail: jest.fn().mockImplementation((res) => {
    emails.push(res);
  }),
};

const mockQueue = {
  add: jest.fn().mockImplementation(console.log),
};

export type TestingModule = {
  container: NestTestingModule;
  mockDB: MockProxy<PrismaClient>;
};

export async function createTestingModule(metadata: ModuleMetadata = {}): Promise<TestingModule> {
  metadata = {
    ...metadata,
    imports: [...(metadata.imports ?? []), DatabaseModule],
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

  const container = await Test.createTestingModule(metadata)
    .overrideProvider(PrismaService)
    .useValue(mockDeep<PrismaClient>())
    .overrideProvider(EmailService)
    .useValue(emailServiceMock)
    .overrideProvider(MailerService)
    .useValue(mailerServiceMock)
    .overrideProvider("BullQueue_email")
    .useValue(mockQueue)
    .compile();

  const mockDB: MockProxy<PrismaClient> = container.get(PrismaService);

  return { container, mockDB };
}
