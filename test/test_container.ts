import { createConnection } from "typeorm";
import { v4 } from "uuid";
import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";

import { databaseProviders } from "../src/lib/repositories/repository.providers";

export async function createTestModule(metadata: ModuleMetadata, entities: any[] = [], logging = false) {
  const db = [
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

  const guess = {
    ...metadata,
    providers: [...(metadata.providers ?? []), ...db],
  };

  console.log({ length: guess.providers.length });

  return await Test.createTestingModule(guess).compile();
}
