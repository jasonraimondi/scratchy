import { createConnection, Connection } from "typeorm";
import { REPOSITORY } from "~/config/inversify";
import { EmailConfirmationRepository } from "~/lib/repository/user/email_confirmation.repository";
import { UserRepository } from "~/lib/repository/user/user.repository";
import { ForgotPasswordRepository } from "~/lib/repository/user/forgot_password.repository";

export const databaseProviders = [
  {
    provide: "DATABASE_CONNECTION",
    useFactory: async () => await createConnection(),
  },
  {
    provide: REPOSITORY.EmailConfirmationRepository,
    useFactory: (connection: Connection) => connection.getCustomRepository(EmailConfirmationRepository),
    inject: ["DATABASE_CONNECTION"],
  },
  {
    provide: REPOSITORY.ForgotPasswordRepository,
    useFactory: (connection: Connection) => connection.getCustomRepository(ForgotPasswordRepository),
    inject: ["DATABASE_CONNECTION"],
  },
  {
    provide: REPOSITORY.UserRepository,
    useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository),
    inject: ["DATABASE_CONNECTION"],
  },
];
