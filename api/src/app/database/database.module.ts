import { Module, Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmailConfirmationToken } from "~/app/account/entities/email_confirmation.entity";
import { ForgotPasswordToken } from "~/app/account/entities/forgot_password.entity";
import { User } from "~/app/user/entities/user.entity";
import { DatabaseService } from "~/app/database/database.service";
import { EmailConfirmationRepo } from "~/app/user/repositories/repositories/email_confirmation.repository";
import { ForgotPasswordRepo } from "~/app/user/repositories/repositories/forgot_password.repository";
import { UserRepo } from "../user/repositories/repositories/user.repository";

const databaseProviders: Provider[] = [UserRepo, ForgotPasswordRepo, EmailConfirmationRepo, DatabaseService];

@Module({
  imports: [TypeOrmModule.forFeature([User, ForgotPasswordToken, EmailConfirmationToken])],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
