import { Module } from "@nestjs/common";

import { databaseProviders } from "~/database/database.provider";
import { userRepositories } from "~/database/user.providers";

@Module({
  providers: [...databaseProviders, ...userRepositories],
  exports: [...databaseProviders, ...userRepositories],
})
export class DatabaseModule {}
