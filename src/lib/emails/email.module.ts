import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

import { QueueModule } from "~/lib/queue/queue.module";
import { ENV } from "~/lib/config/environment";
import { emailProviders } from "~/lib/emails/email.providers";
import { RepositoryModule } from "~/lib/repositories/repository.module";

@Module({
  imports: [
    QueueModule,
    RepositoryModule,
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
