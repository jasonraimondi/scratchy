import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

import { QueueModule } from "~/app/queues/queue.module";
import { ENV } from "~/config/environments";
import { emailProviders } from "~/app/emails/email.providers";
import { DatabaseModule } from "~/app/database/database.module";

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
  ],
  providers: [...emailProviders],
  exports: [...emailProviders],
})
export class EmailModule {}
