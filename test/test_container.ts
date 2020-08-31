import { createConnection } from "typeorm";
import { v4 } from "uuid";
import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { MailerModule } from "@nestjs-modules/mailer";
import { BullModule } from "@nestjs/bull";

import { databaseProviders } from "~/lib/repositories/repository.providers";
import { QUEUE } from "~/lib/config/keys";
import { EmailService } from "~/lib/emails/services/email.service";
import { ENV } from "~/lib/config/environment";

const mockTransport = {
  name: "mock-transport",
  version: "1.0.0",
  send: (mail: any, callback: any) => {
    console.log(mail);
    const input = mail.message.createReadStream();
    input.pipe(process.stdout);
    input.on("end", function () {
      callback(null, true);
    });
  },
};

import produce from "immer";

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

  const emailImports: any = [
    // BullModule.registerQueue({
    //   name: QUEUE.email,
    //   redis: ENV.queueURL
    // }),
    // MailerModule.forRoot({
    //   transport: mockTransport,
    //   defaults: {
    //     from: `"graphql-scratchy" <jason+scratchy@raimondi.us>`,
    //   },
    // }),
  ];

  const tester = produce(metadata, (draft: ModuleMetadata) => {
    draft.imports = draft.imports ?? [];
    draft.providers = draft.providers ?? [];

    draft.imports.push(...emailImports);
    // draft.providers.push(EmailService);
    draft.providers.push(...repositoryProviders);
  });
  return Test.createTestingModule(tester).compile();
}
