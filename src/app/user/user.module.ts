import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { MeResolver } from "~/app/user/resolvers/me.resolver";
import { UserResolver } from "~/app/user/resolvers/user.resolver";
import { QUEUE } from "~/lib/config/keys";
import { EmailModule } from "~/lib/emails/email.module";
import { RepositoryModule } from "~/lib/repositories/repository.module";

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
