import { TestingModule } from "@nestjs/testing";
import { AuthModule } from "~/app/auth/auth.module";

import { EmailConfirmationResolver } from "~/app/signup/resolvers/email_confirmation.resolver";
import { SignupModule } from "~/app/signup/signup.module";
import { VerifyEmailInput } from "~/app/user/dtos/verify_email.input";
import { Permission } from "~/entity/role/permission.entity";
import { Role } from "~/entity/role/role.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/config/keys";
import { IEmailConfirmationRepository } from "~/lib/repositories/user/email_confirmation.repository";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";

describe("emails confirmation resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let resolver: EmailConfirmationResolver;
  let userRepository: IUserRepository;
  let emailConfirmationRepository: IEmailConfirmationRepository;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [SignupModule],
      },
      entities,
    );
    userRepository = moduleRef.get(REPOSITORY.UserRepository);
    emailConfirmationRepository = moduleRef.get(REPOSITORY.EmailConfirmationRepository);
    resolver = moduleRef.get(EmailConfirmationResolver);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe("verify user emails confirmation", () => {
    test("resolve user by id", async () => {
      // arrange
      const user = await userGenerator();
      await userRepository.save(user);
      const emailConfirmation = new EmailConfirmationToken(user);
      await emailConfirmationRepository.save(emailConfirmation);

      // act
      const input = new VerifyEmailInput();
      input.id = emailConfirmation.id;
      input.email = user.email;
      await resolver.verifyEmailConfirmation(input);
      const result = emailConfirmationRepository.findByEmail(user.email);

      // assert
      await expect(result).rejects.toThrowError('Could not find any entity of type "EmailConfirmationToken"');
    });
  });
});
