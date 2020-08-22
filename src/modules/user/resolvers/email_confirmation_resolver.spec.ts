import { User } from "../../entity/user/user_entity";
import { ForgotPassword } from "../../entity/user/forgot_password_entity";
import { Role } from "../../entity/role/role_entity";
import { Permission } from "../../entity/role/permission_entity";
import { REPOSITORY } from "../../lib/constants/inversify";
import { EmailConfirmation } from "../../entity/user/email_confirmation_entity";
import { TestingContainer } from "../../../test/test_container";
import { EmailConfirmationResolver } from "./email_confirmation_resolver";
import { IEmailConfirmationRepository } from "../../lib/repository/user/email_confirmation_repository";
import { VerifyEmailInput } from "./dtos/verify_email_input";
import { IUserRepository } from "../../lib/repository/user/user_repository";

describe("email confirmation resolver", () => {
  const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

  let container: TestingContainer;
  let resolver: EmailConfirmationResolver;
  let userRepository: IUserRepository;
  let emailConfirmationRepository: IEmailConfirmationRepository;

  beforeEach(async () => {
    container = await TestingContainer.create(entities);
    userRepository = container.get(REPOSITORY.UserRepository);
    emailConfirmationRepository = container.get(
      REPOSITORY.EmailConfirmationRepository,
    );
    resolver = container.get(EmailConfirmationResolver);
  });

  describe("verify user email confirmation", () => {
    test("resolve user by id", async () => {
      // arrange
      const user = await User.create({ email: "jason@raimondi.us" });
      await userRepository.save(user);
      const emailConfirmation = new EmailConfirmation(user);
      await emailConfirmationRepository.save(emailConfirmation);

      // act
      const input = new VerifyEmailInput();
      input.id = emailConfirmation.id;
      input.email = user.email;
      await resolver.verifyEmailConfirmation(input);
      const result = emailConfirmationRepository.findByEmail(user.email);

      // assert
      await expect(result).rejects.toThrowError(
        'Could not find any entity of type "EmailConfirmation"',
      );
    });
  });
});
