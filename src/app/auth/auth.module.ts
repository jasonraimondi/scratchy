import { Module } from "@nestjs/common";

import { AuthController } from "~/app/auth/auth.controller";
import { AuthService } from "~/app/auth/auth.service";
import { ForgotPasswordResolver } from "~/app/auth/resolvers/forgot_password.resolver";
import { LoginResolver } from "~/app/auth/resolvers/login.resolver";
import { LogoutResolver } from "~/app/auth/resolvers/logout.resolver";
import { RepositoryModule } from "~/lib/repositories/repository.module";
import { EmailModule } from "~/lib/emails/email.module";

@Module({
  controllers: [AuthController],
  imports: [EmailModule, RepositoryModule],
  providers: [AuthService, ForgotPasswordResolver, LogoutResolver, LoginResolver],
})
export class AuthModule {}
