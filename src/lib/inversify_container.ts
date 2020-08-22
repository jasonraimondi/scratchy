import { Container as InversifyContainer, interfaces } from "inversify";

import { AppResolver } from "~/modules/app/app_resolver";
import { ServiceFactory } from "~/lib/services/service_factory";
import { ForgotPasswordResolver } from "~/modules/user/forgot_password_resolver";
import { MeResolver } from "~/modules/user/me_resolver";
import { IEmailConfirmationRepository } from "~/lib/repository/user/email_confirmation_repository";
import { EmailConfirmationResolver } from "~/modules/user/email_confirmation_resolver";
import { IUserRepository } from "~/lib/repository/user/user_repository";
import { RegisterEmail } from "~/lib/services/email/user/register_email";
import { RegisterResolver } from "~/modules/user/register_resolver";
import { AuthService } from "~/lib/services/auth/auth_service";
import { AuthResolver } from "~/modules/user/auth_resolver";
import { IMailer } from "~/lib/services/email/mailer";
import { ForgotPasswordEmail } from "~/lib/services/email/user/forgot_password_email";
import { REPOSITORY, SERVICE } from "~/lib/constants/inversify";
import { IForgotPasswordRepository } from "~/lib/repository/user/forgot_password_repository";
import { UserResolver } from "~/modules/user/user_resolver";
import { RepositoryFactory } from "~/lib/repository/repository_factory";

export class Container extends InversifyContainer {
  public constructor(
    protected readonly repositoryFactory: RepositoryFactory,
    protected readonly serviceFactory: ServiceFactory,
    containerOptions?: interfaces.ContainerOptions,
  ) {
    super(containerOptions);
    this.bindContainer();
  }

  protected bindContainer(): void {
    // app resolvers
    this.bind(AppResolver).toSelf();
    this.bind(AuthResolver).toSelf();
    this.bind(ForgotPasswordResolver).toSelf();
    this.bind(MeResolver).toSelf();
    this.bind(RegisterResolver).toSelf();
    this.bind(EmailConfirmationResolver).toSelf();
    this.bind(UserResolver).toSelf();

    // services
    this.bind<IMailer>(SERVICE.Mailer).toConstantValue(
      this.serviceFactory.emailService,
    );
    this.bind<AuthService>(SERVICE.AuthService).to(AuthService);

    // emails
    this.bind<ForgotPasswordEmail>(SERVICE.ForgotPasswordEmail).to(
      ForgotPasswordEmail,
    );
    this.bind<RegisterEmail>(SERVICE.RegisterEmail).to(RegisterEmail);

    // repositories
    this.bind<IForgotPasswordRepository>(
      REPOSITORY.ForgotPasswordRepository,
    ).toConstantValue(this.repositoryFactory.forgotPassword);
    this.bind<IUserRepository>(REPOSITORY.UserRepository).toConstantValue(
      this.repositoryFactory.user,
    );
    this.bind<IEmailConfirmationRepository>(
      REPOSITORY.EmailConfirmationRepository,
    ).toConstantValue(this.repositoryFactory.emailConfirmation);
  }
}
