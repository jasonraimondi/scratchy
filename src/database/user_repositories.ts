import { Connection } from "typeorm";
import { UserRepository } from "~/lib/repository/user/user_repository";
import { EmailConfirmationRepository } from "~/lib/repository/user/email_confirmation_repository";
import { ForgotPasswordRepository } from "~/lib/repository/user/forgot_password_repository";
import { REPOSITORY } from "~/lib/constants/inversify";

export const userRepositories = [
  {
    provide: REPOSITORY.EmailConfirmationRepository,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(EmailConfirmationRepository),
    inject: ["DATABASE_CONNECTION"],
  },
  {
    provide: REPOSITORY.ForgotPasswordRepository,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(ForgotPasswordRepository),
    inject: ["DATABASE_CONNECTION"],
  },
  {
    provide: REPOSITORY.UserRepository,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(UserRepository),
    inject: ["DATABASE_CONNECTION"],
  },
];
