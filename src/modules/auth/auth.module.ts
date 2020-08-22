import { Module } from "@nestjs/common";

import { AuthController } from "~/modules/auth/auth.controller";
import { AuthService } from "~/modules/auth/auth.service";
import { RepositoryModule } from "~/lib/repositories/repository.module";
import { ForgotPasswordResolver } from "~/modules/auth/resolvers/forgot_password_resolver";
import { LoginResolver } from "~/modules/auth/resolvers/login_resolver";
import { LogoutResolver } from "~/modules/auth/resolvers/logout_resolver";

@Module({
  controllers: [AuthController],
  imports: [RepositoryModule],
  providers: [
    AuthService,
    // ForgotPasswordResolver,
    LogoutResolver,
    LoginResolver,
  ],
})
export class AuthModule {}
