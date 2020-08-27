import { TestingModule } from "@nestjs/testing";

import { Role } from "~/entity/role/role_entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import { VerifyEmailInput } from "~/app/user/dtos/verify_email_input";
import { User } from "~/entity/user/user_entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";
import { IEmailConfirmationRepository } from "~/lib/repositories/user/email_confirmation.repository";
import { Permission } from "~/entity/role/permission_entity";
import { EmailConfirmationResolver } from "~/app/signup/resolvers/email_confirmation_resolver";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { REPOSITORY } from "~/lib/config/keys";
import { createTestingModule } from "~test/test_container";

describe("emails confirmation resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let resolver: EmailConfirmationResolver;
  let userRepository: IUserRepository;
  let emailConfirmationRepository: IEmailConfirmationRepository;

  beforeEach(async () => {
    container = await createTestingModule(
      {
        providers: [EmailConfirmationResolver],
      },
      entities,
    );
    userRepository = container.get(REPOSITORY.UserRepository);
    emailConfirmationRepository = container.get(REPOSITORY.EmailConfirmationRepository);
    resolver = container.get(EmailConfirmationResolver);
  });

  describe.skip("verify user emails confirmation", () => {
    test("resolve user by id", async () => {
      // arrange
      const user = await User.create({ email: "jason@raimondi.us" });
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
      await expect(result).rejects.toThrowError('Could not find any entity of type "EmailConfirmation"');
    });
  });
});
