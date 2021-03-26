import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { MailerService } from "@nestjs-modules/mailer";

import { Permission } from "~/app/user/entities/permission.entity";
import { Role } from "~/app/user/entities/role.entity";
import { EmailConfirmationToken } from "~/app/account/entities/email_confirmation.entity";
import { ForgotPasswordToken } from "~/app/account/entities/forgot_password.entity";
import { User } from "~/app/user/entities/user.entity";
import { EmailService } from "~/app/emails/services/email.service";
import { DatabaseModule } from "~/lib/database/database.module";
import { emails, emailServiceMock } from "./mock_email_service";
import { PrismaService } from "~/lib/database/prisma.service";

const mailerServiceMock = {
  sendMail: jest.fn().mockImplementation((res) => {
    emails.push(res);
  }),
};

const mockQueue = {
  add: jest.fn().mockImplementation(console.log),
};

const baseEntities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

export async function createTestingModule(
  metadata: ModuleMetadata = {},
  // entities: EntityClassOrSchema[] = [],
  // logging = false,
) {
  metadata = {
    ...metadata,
    imports: [DatabaseModule, ...(metadata.imports ?? [])],
    providers: [
      PrismaService,
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
