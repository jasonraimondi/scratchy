import { Module } from "@nestjs/common";

import { AuthController } from "~/app/auth/auth.controller";
import { AuthService } from "~/app/auth/auth.service";
import { RepositoryModule } from "~/lib/repositories/repository.module";
import { ForgotPasswordResolver } from "~/app/auth/resolvers/forgot_password_resolver";
import { LoginResolver } from "~/app/auth/resolvers/login_resolver";
import { LogoutResolver } from "~/app/auth/resolvers/logout_resolver";

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
