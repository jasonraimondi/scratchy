import { Module } from "@nestjs/common";

import { MeResolver } from "~/app/user/resolvers/me.resolver";
import { UserResolver } from "~/app/user/resolvers/user.resolver";
import { RegisterResolver } from "~/app/user/resolvers/account/register.resolver";
import { ForgotPasswordService } from "~/app/user/services/forgot_password.service";
import { ForgotPasswordResolver } from "~/app/user/resolvers/account/forgot_password.resolver";
import { EmailConfirmationService } from "~/app/user/services/email_confirmation.service";
import { AuthService } from "~/app/auth/services/auth.service";
import { EmailConfirmationResolver } from "~/app/user/resolvers/account/email_confirmation.resolver";
import { TokenService } from "~/app/auth/services/token.service";
import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { EmailModule } from "~/lib/email/email.module";

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    JwtModule,
    EmailModule,
    // PassportModule
  ],
  providers: [
    MeResolver,
    UserResolver,
    RegisterResolver,
    ForgotPasswordService,
    EmailConfirmationService,
    ForgotPasswordResolver,
    EmailConfirmationResolver,
    AuthService,
    TokenService,
  ],
})
export class UserModule {}
