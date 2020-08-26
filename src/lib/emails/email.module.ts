import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { MailerModule } from "@nestjs-modules/mailer";

import { QUEUE } from "~/lib/config/keys";
import { ENV } from "~/lib/config/environment";
import { emailProviders } from "~/lib/emails/email.providers";
import { SendEmailProcessor } from "~/lib/emails/processors/send_email.processor";
import { EmailService } from "~/lib/emails/services/email.service";
import { RepositoryModule } from "~/lib/repositories/repository.module";
import { EmailTemplateService } from "~/lib/emails/services/email_template.service";

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
