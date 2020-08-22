import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { MailerModule } from "@nestjs-modules/mailer";

import { QUEUE } from "~/config/inversify";
import { ENV } from "~/config/environment";
import { emailProviders } from "~/modules/email/email.providers";
import { SendEmailProcessor } from "~/modules/email/processors/send_email.processor";
import { EmailService } from "~/modules/email/services/email.service";
import { RepositoryModule } from "~/modules/repository/repository.module";
import { EmailTemplateService } from "~/modules/email/services/email_template.service";

@Module({
  imports: [
    RepositoryModule,
    MailerModule.forRoot({
      transport: ENV.mailerURL,
      defaults: {
        from: `"graphql-scratchy" <jason+scratchy@raimondi.us>`,
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
  providers: [EmailService, EmailTemplateService, SendEmailProcessor, ...emailProviders],
  exports: [...emailProviders],
})
export class EmailModule {}
