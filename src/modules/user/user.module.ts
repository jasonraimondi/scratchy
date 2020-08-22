import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";

import { UserResolver } from "~/modules/user/resolvers/user_resolver";
import { MeResolver } from "~/modules/user/resolvers/me_resolver";
import { RepositoryModule } from "~/lib/repository/repository.module";
import { QUEUE } from "~/config/inversify";
import { EmailModule } from "~/lib/email/email.module";

@Module({
  imports: [
    EmailModule,
    RepositoryModule,
    BullModule.registerQueue({
      name: QUEUE.email,
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
  ],
  providers: [MeResolver, UserResolver],
})
export class UserModule {}
