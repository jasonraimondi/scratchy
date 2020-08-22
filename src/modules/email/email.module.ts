import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { MailerModule } from "@nestjs-modules/mailer";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

import { QUEUE } from "~/lib/constants/inversify";
import { ENV } from "~/lib/constants/config";
import { emailProviders } from "~/modules/email/email.providers";
import { SendEmailProcessor } from "~/modules/email/processors/send_email.processor";
import { EmailService } from "~/modules/email/services/email.service";
import { RepositoryModule } from "~/modules/repository/repository.module";

@Module({
  imports: [
    RepositoryModule,
    MailerModule.forRoot({
      transport: ENV.mailerURL,
      defaults: {
        from: `"graphql-scratchy" <jason+scratchy@raimondi.us>`,
      },
      template: {
        dir: join(__dirname, "/templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    BullModule.registerQueue({
      name: QUEUE.email,
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
  ],
  providers: [EmailService, SendEmailProcessor, ...emailProviders],
  exports: [...emailProviders],
})
export class EmailModule {
}
