import { Module } from "@nestjs/common";

import { databaseProviders } from "~/database/database.provider";
import { userRepositories } from "~/database/user_repositories";

@Module({
  providers: [...databaseProviders, ...userRepositories],
  exports: [...databaseProviders, ...userRepositories],
})
export class DatabaseModule {}
