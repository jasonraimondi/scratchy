import { Module } from "@nestjs/common";

import { MeResolver } from "~/app/user/users/me.resolver";
import { UserResolver } from "~/app/user/users/user.resolver";
import { RegisterResolver } from "~/app/user/register/register.resolver";
import { ForgotPasswordService } from "~/app/user/forgot_password/forgot_password.service";
import { ForgotPasswordResolver } from "~/app/user/forgot_password/forgot_password.resolver";
import { EmailConfirmationService } from "~/app/user/email_confirmation/email_confirmation.service";
import { AuthService } from "~/app/auth/services/auth.service";
import { EmailConfirmationResolver } from "~/app/user/email_confirmation/email_confirmation.resolver";
import { TokenService } from "~/app/auth/services/token.service";
import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { EmailModule } from "~/app/email/email.module";
import { UpdatePasswordResolver } from "~/app/user/update_password/update_password.resolver";

@Module({
  imports: [LoggerModule, DatabaseModule, JwtModule, EmailModule],
  providers: [
    AuthService,
    ForgotPasswordService,
    EmailConfirmationService,
    TokenService,

    EmailConfirmationResolver,
    ForgotPasswordResolver,
    MeResolver,
    RegisterResolver,
    UpdatePasswordResolver,
    UserResolver,
  ],
})
export class UserModule {}
