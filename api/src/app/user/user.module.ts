import { Module } from "@nestjs/common";

import { DatabaseModule } from "~/lib/database/database.module";
import { MeResolver } from "~/app/user/resolvers/me.resolver";
import { UserResolver } from "~/app/user/resolvers/user.resolver";
import { LoggerModule } from "~/lib/logger/logger.module";

@Module({
  imports: [LoggerModule, DatabaseModule],
  providers: [MeResolver, UserResolver],
})
export class UserModule {}
