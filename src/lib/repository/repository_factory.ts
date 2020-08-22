import { Connection } from "typeorm";
import { ForgotPasswordRepository, IForgotPasswordRepository } from "@/lib/repository/user/forgot_password_repository";
import {
  EmailConfirmationRepository,
  IEmailConfirmationRepository,
} from "@/lib/repository/user/email_confirmation_repository";
import { IUserRepository, UserRepository } from "@/lib/repository/user/user_repository";

export class RepositoryFactory {
  constructor(private readonly connection: Connection) {}

  get forgotPassword(): IForgotPasswordRepository {
    return this.connection.getCustomRepository<ForgotPasswordRepository>(ForgotPasswordRepository);
  }

  get user(): IUserRepository {
    return this.connection.getCustomRepository<UserRepository>(UserRepository);
  }

  get emailConfirmation(): IEmailConfirmationRepository {
    return this.connection.getCustomRepository<EmailConfirmationRepository>(EmailConfirmationRepository);
  }
}
