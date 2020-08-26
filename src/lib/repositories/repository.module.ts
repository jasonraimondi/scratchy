import { Module } from "@nestjs/common";
import { createConnection } from "typeorm";

import { databaseProviders } from "~/lib/repositories/repository.providers";

@Module({
  providers: [
    {
      provide: "DATABASE_CONNECTION",
      useFactory: async () => await createConnection(),
    },
    ...databaseProviders,
  ],
  exports: [...databaseProviders],
})
export class RepositoryModule {}
