import { Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccessToken } from "~/entity/oauth/access_token.entity";
import { Client } from "~/entity/oauth/client.entity";

import { Permission } from "~/entity/role/permission.entity";
import { Role } from "~/entity/role/role.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { DatabaseService } from "~/lib/repositories/repository.service";
import { EmailConfirmationRepo } from "~/lib/repositories/user/email_confirmation.repository";
import { ForgotPasswordRepo } from "~/lib/repositories/user/forgot_password.repository";
import { UserRepo } from "./user/user.repository";

const databaseProviders: Provider[] = [UserRepo, ForgotPasswordRepo, EmailConfirmationRepo, DatabaseService];

@Module({
  imports: [TypeOrmModule.forFeature([EmailConfirmationToken, ForgotPasswordToken, User, Role, Permission])],
  providers: [...databaseProviders],
  exports: [TypeOrmModule, ...databaseProviders],
})
export class RepositoryModule {}
