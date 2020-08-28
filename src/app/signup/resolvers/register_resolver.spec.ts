import { validate } from "class-validator";
import { TestingModule } from "@nestjs/testing";

import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import { EmailConfirmationRepository } from "~/lib/repositories/user/email_confirmation.repository";
import { User } from "~/entity/user/user_entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { RegisterInput } from "~/app/user/dtos/register_input";
import { RegisterEmail } from "~/lib/emails/modules/signup/register.email";
import { createTestingModule } from "~test/test_container";
import { RegisterResolver } from "~/app/signup/resolvers/register_resolver";
import { Role } from "~/entity/role/role_entity";
import { Permission } from "~/entity/role/permission_entity";
import { mockContext } from "~test/mock_application";
import { REPOSITORY } from "~/lib/config/keys";

describe("register_resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let userRepository: IUserRepository;
  let context: any;

  beforeEach(async () => {
    container = await createTestingModule(
      {
        providers: [RegisterResolver, RegisterEmail],
      },
      entities,
    );
    context = mockContext({ container });
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
  });

  describe("register function", () => {
    test("valid register input is validated correctly", async () => {
      // arrange
      const validInput = new RegisterInput();
      validInput.email = "jason@raimondi.us";

      // act
      const validationErrors = await validate(validInput);

      // assert
      expect(validationErrors.length).toBe(0);
    });

    test("invalid register input has errors thrown", async () => {
      // arrange
      const validInput = new RegisterInput();
      validInput.email = "jason@raimondi";

      // act
      const validationErrors = await validate(validInput);

      // assert
      expect(validationErrors.length).toBe(1);
    });

    test("duplicate user id is denied", async () => {
      // arrange
      const resolver = container.get<RegisterResolver>(RegisterResolver);
      const input = new RegisterInput();
      input.id = "b031765a-a950-4a0d-92dd-ecd12788f3a6n";
      input.email = "jason@raimondi.us";
      await userRepository.save(await User.create(input));

      // act
      const result = resolver.register(input, context);

      // assert
      await expect(result).rejects.toThrowError("duplicate id for user");
    });

    test("duplicate user emails is denied", async () => {
      // arrange
      const resolver = container.get<RegisterResolver>(RegisterResolver);
      const input = new RegisterInput();
      input.email = "jason@raimondi.us";
      await userRepository.save(await User.create(input));

      // act
      const result = resolver.register(input, context);

      // assert
      await expect(result).rejects.toThrowError("duplicate emails for user");
    });

    test("user is registered with emails confirmation", async () => {
      // arrange
      const resolver = container.get<RegisterResolver>(RegisterResolver);
      const input = new RegisterInput();
      input.email = "jason@raimondi.us";

      // act
      const result = await resolver.register(input, context);

      // assert
      const emailConfirmationRepository = container.get<EmailConfirmationRepository>(
        REPOSITORY.EmailConfirmationRepository,
      );
      const emailConfirmation = await emailConfirmationRepository.findByEmail("jason@raimondi.us");
      expect(result.user).toBeTruthy();
      expect(result.user.id).toBe(emailConfirmation.user.id);
      expect(result.user.email).toBe("jason@raimondi.us");
      expect(result.user.isEmailConfirmed).toBeFalsy();
    });
  });

  describe("resentConfirmEmail", () => {
    test("resend emails function works", async () => {
      // arrange
      const resolver = container.get<RegisterResolver>(RegisterResolver);
      const input = new RegisterInput();
      input.email = "jason@raimondi.us";
      await resolver.register(input, context);

      // act
      const result = await resolver.resentConfirmEmail("jason@raimondi.us");

      // assert
      expect(result).toBe(true);
    });

    test("resend emails throws for invalid user", async () => {
      // arrange
      const resolver = container.get<RegisterResolver>(RegisterResolver);

      // act
      const result = resolver.resentConfirmEmail("jason@raimondi.us");

      // assert
      await expect(result).rejects.toThrow(new RegExp('Could not find any entity of type "EmailConfirmationToken"'));
    });
  });
});
