import { Module } from "@nestjs/common";

import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { RegisterResolver } from "~/app/user/register/register.resolver";
import { AuthService } from "~/app/auth/services/auth.service";
import { TokenService } from "~/app/auth/services/token.service";
import { EmailModule } from "~/lib/email/email.module";
import { JwtModule } from "~/lib/jwt/jwt.module";

@Module({
  imports: [DatabaseModule, EmailModule, JwtModule, LoggerModule],
  providers: [RegisterResolver, AuthService, TokenService],
})
export class RegisterModule {}
