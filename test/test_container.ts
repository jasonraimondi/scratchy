import { createConnection } from "typeorm";
import { v4 } from "uuid";
import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";

import { databaseProviders } from "../src/lib/repositories/repository.providers";
import { EmailModule } from "../src/lib/emails/email.module";

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

  return Test.createTestingModule({
    ...metadata,
    providers: [
      ...(metadata.providers ?? []),
      ...repositoryProviders
    ],
  }).compile();
}
