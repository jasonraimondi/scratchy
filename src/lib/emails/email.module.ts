import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

import { QueueModule } from "~/lib/queue/queue.module";
import { ENV } from "~/lib/config/environment";
import { emailProviders } from "~/lib/emails/email.providers";
import { SendEmailProcessor } from "~/lib/emails/processors/send_email.processor";
import { EmailService } from "~/lib/emails/services/email.service";
import { EmailTemplateService } from "~/lib/emails/services/email_template.service";
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
  providers: [EmailService, EmailTemplateService, SendEmailProcessor, ...emailProviders],
  exports: [...emailProviders],
})
export class EmailModule {}
