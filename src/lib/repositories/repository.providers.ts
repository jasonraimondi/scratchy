import { Provider } from "@nestjs/common/interfaces/modules/provider.interface";
import { Connection } from "typeorm";

import { REPOSITORY, SERVICES } from "~/config/keys";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { EmailConfirmationRepository } from "~/lib/repositories/user/email_confirmation.repository";
import { ForgotPasswordRepository } from "~/lib/repositories/user/forgot_password.repository";
import { UserRepository } from "~/lib/repositories/user/user.repository";

export const databaseProviders: Provider[] = [
  {
    provide: REPOSITORY.EmailConfirmationRepository,
    useFactory: (connection: Connection) => new EmailConfirmationRepository(connection.getRepository(EmailConfirmationToken)),
    inject: [SERVICES.connection],
  },
  {
    provide: REPOSITORY.ForgotPasswordRepository,
    useFactory: (connection: Connection) => new ForgotPasswordRepository(connection.getRepository(ForgotPasswordToken)),
    inject: [SERVICES.connection],
  },
  {
    provide: REPOSITORY.UserRepository,
    useFactory: (connection: Connection) => new UserRepository(connection.getRepository(User)),
    inject: [SERVICES.connection],
  },
];
