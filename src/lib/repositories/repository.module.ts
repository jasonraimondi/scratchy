import { Module } from "@nestjs/common";
import { databaseProviders } from "~/lib/repositories/repository.providers";

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class RepositoryModule {}
