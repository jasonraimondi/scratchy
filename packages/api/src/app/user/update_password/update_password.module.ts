import { Module } from "@nestjs/common";

import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";

import { UpdatePasswordResolver } from "~/app/user/update_password/update_password.resolver";

@Module({
  imports: [DatabaseModule, LoggerModule],
  providers: [UpdatePasswordResolver],
})
export class UpdatePasswordModule {}
