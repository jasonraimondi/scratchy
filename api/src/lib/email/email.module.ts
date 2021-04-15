import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

import { QueueModule } from "~/lib/queue/queue.module";
import { ENV } from "~/config/environments";
import { emailProviders } from "~/lib/email/email.providers";
import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";

@Module({
  imports: [
    QueueModule,
    DatabaseModule,
    MailerModule.forRoot({
      transport: ENV.mailerURL,
      defaults: {
        from: `"graphql-scratchy" <jason+scratchy@raimondi.us>`,
      },
    }),
    LoggerModule,
  ],
  providers: [...emailProviders],
  exports: [...emailProviders],
})
export class EmailModule {}
