import { Module } from "@nestjs/common";
import { databaseProviders } from "~/modules/repository/repository.providers";

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class RepositoryModule {}
