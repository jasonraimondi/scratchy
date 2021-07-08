import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

import { QueueModule } from "~/lib/queue/queue.module";
import { ENV } from "~/config/environments";
import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { EmailService } from "~/lib/email/services/email.service";
import { EmailTemplateService } from "~/lib/email/services/email_template.service";
import { RegisterMailer } from "~/lib/email/mailers/register.mailer";
import { ForgotPasswordMailer } from "~/lib/email/mailers/forgot_password.mailer";

const emailProviders = [EmailService, EmailTemplateService, RegisterMailer, ForgotPasswordMailer];

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
