import { Module } from "@nestjs/common";
import { createConnection } from "typeorm";
import { SERVICES } from "~/config/keys";

import { databaseProviders } from "~/lib/repositories/repository.providers";

@Module({
  providers: [
    {
      provide: SERVICES.connection,
      useFactory: async () => await createConnection(),
    },
    ...databaseProviders,
  ],
  exports: [...databaseProviders],
})
export class RepositoryModule {}
