import { Connection } from "typeorm";

import { REPOSITORY, SERVICES } from "~/config/keys";
import { EmailConfirmationRepository } from "~/lib/repositories/user/email_confirmation.repository";
import { ForgotPasswordRepository } from "~/lib/repositories/user/forgot_password.repository";
import { UserRepository } from "~/lib/repositories/user/user.repository";

export const databaseProviders = [
  {
    provide: REPOSITORY.EmailConfirmationRepository,
    useFactory: (connection: Connection) => connection.getCustomRepository(EmailConfirmationRepository),
    inject: [SERVICES.connection],
  },
  {
    provide: REPOSITORY.ForgotPasswordRepository,
    useFactory: (connection: Connection) => connection.getCustomRepository(ForgotPasswordRepository),
    inject: [SERVICES.connection],
  },
  {
    provide: REPOSITORY.UserRepository,
    useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository),
    inject: [SERVICES.connection],
  },
];
