import { MiddlewareConsumer, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import csurf from "csurf";

import { EmailConfirmationController } from "~/app/account/controllers/email_confirmation.controller";
import { ForgotPasswordController } from "~/app/account/controllers/forgot_password.controller";
import { ResetPasswordController } from "~/app/account/controllers/reset_password.controller";
import { EmailConfirmationService } from "~/app/account/services/email_confirmation.service";
import { ForgotPasswordService } from "~/app/account/services/forgot_password.service";
import { RegisterResolver } from "~/app/account/resolvers/register.resolver";
import { EmailModule } from "~/app/emails/email.module";
import { LoggerModule } from "~/app/logger/logger.module";
import { DatabaseModule } from "~/app/database/database.module";

const controllers = [ForgotPasswordController, ResetPasswordController, EmailConfirmationController];

@Module({
  controllers,
  imports: [EmailModule, PassportModule, LoggerModule, DatabaseModule],
  providers: [ForgotPasswordService, EmailConfirmationService, RegisterResolver],
})
export class AccountModule {
  configure(consumer: MiddlewareConsumer) {
    const middlewares = [csurf({ cookie: { httpOnly: true } })];
    consumer.apply(...middlewares).forRoutes(...controllers);
  }
}
