import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { MailerService } from "@nestjs-modules/mailer";
import { TestingModule as NestTestingModule } from "@nestjs/testing/testing-module";
import { HttpAdapterHost } from "@nestjs/core";
import { produce } from "immer";

import { emails, emailServiceMock } from "./mock_email_service";
import { DatabaseModule } from "~/lib/database/database.module";
import { EmailService } from "~/lib/email/services/email.service";
import { PrismaService } from "~/lib/database/prisma.service";
import { LoggerModule } from "~/lib/logger/logger.module";
import { EmailModule } from "~/lib/email/email.module";

const mailerServiceMock = {
  sendMail: jest.fn().mockImplementation(res => {
    emails.push(res);
  }),
};

const mockQueue = {
  add: jest.fn().mockImplementation(console.log),
};

const MockHttpAdapterHost = jest.fn().mockImplementation(() => ({
  adapterHost: {
    httpAdapter: {
      getInstance: () => jest.fn(),
    },
  },
}));

export type TestingModule = {
  container: NestTestingModule;
  prisma: PrismaService;
};

export async function createTestingModule(rawMetadata: ModuleMetadata = {}): Promise<TestingModule> {
  const metadata = produce(rawMetadata, meta => {
    meta.imports = meta.imports ?? [];
    meta.imports.push(DatabaseModule, LoggerModule, EmailModule);
  });

  const container = await Test.createTestingModule(metadata)
    .overrideProvider(EmailService)
    .useValue(emailServiceMock)
    .overrideProvider(MailerService)
    .useValue(mailerServiceMock)
    .overrideProvider("BullQueue_email")
    .useValue(mockQueue)
    .overrideProvider(HttpAdapterHost)
    .useValue(MockHttpAdapterHost)
    .compile();

  const prisma = container.get(PrismaService);

  return { container, prisma };
}
