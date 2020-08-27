import { createConnection } from "typeorm";
import { v4 } from "uuid";
import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";

import { databaseProviders } from "~/lib/repositories/repository.providers";
import { MailerModule } from "@nestjs-modules/mailer";
import { ENV } from "~/lib/config/environment";
import { BullModule } from "@nestjs/bull";
import { QUEUE } from "~/lib/config/keys";
import { EmailService } from "~/lib/emails/services/email.service";

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

  const emailImports = [
    BullModule.registerQueue({
      name: QUEUE.email,
    }),
    MailerModule.forRoot({
      transport: ENV.mailerURL,
      defaults: {
        from: `"graphql-scratchy" <jason+scratchy@raimondi.us>`,
      },
    }),
  ];

  return Test.createTestingModule({
    ...metadata,
    imports: [...(metadata.imports ?? []), ...emailImports],
    providers: [...(metadata.providers ?? []), EmailService, ...repositoryProviders],
  }).compile();
}
