import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

import { QueueModule } from "~/app/queue/queue.module";
import { ENV } from "~/config/environments";
import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { EmailService } from "~/app/email/services/email.service";
import { EmailTemplateService } from "~/app/email/services/email_template.service";
import { RegisterEmail } from "~/app/email/emails/register.email";
import { ForgotPasswordEmail } from "~/app/email/emails/forgot_password.email";

const emailProviders = [EmailService, EmailTemplateService, RegisterEmail, ForgotPasswordEmail];

@Module({
  imports: [
    QueueModule,
    DatabaseModule,
    MailerModule.forRoot({
      transport: ENV.mailerURL,
      defaults: {
        from: ENV.mailer.from,
      },
    }),
    LoggerModule,
  ],
  providers: [...emailProviders],
  exports: [...emailProviders],
})
export class EmailModule {}
