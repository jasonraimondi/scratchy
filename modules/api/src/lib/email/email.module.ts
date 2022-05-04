import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

import { ENV } from "~/config/environment";
import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { EmailService } from "~/lib/email/services/email.service";
import { EmailTemplateService } from "~/lib/email/services/email_template.service";
import { RegisterMailer } from "~/lib/email/mailers/register.mailer";
import { ForgotPasswordMailer } from "~/lib/email/mailers/forgot_password.mailer";

// prettier-ignore
const emailProviders = [
  EmailService,
  EmailTemplateService,
  RegisterMailer,
  ForgotPasswordMailer,
];

@Module({
  imports: [
    DatabaseModule,
    MailerModule.forRoot({
      transport: ENV.mailer.host,
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
