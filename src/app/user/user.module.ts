import { Module } from "@nestjs/common";

import { MeResolver } from "~/app/user/resolvers/me.resolver";
import { UserResolver } from "~/app/user/resolvers/user.resolver";
import { EmailModule } from "~/app/emails/email.module";
import { LoggerModule } from "~/app/logger/logger.module";
import { DatabaseModule } from "~/app/database/database.module";

@Module({
  imports: [EmailModule, LoggerModule, DatabaseModule],
  providers: [MeResolver, UserResolver],
})
export class UserModule {}
