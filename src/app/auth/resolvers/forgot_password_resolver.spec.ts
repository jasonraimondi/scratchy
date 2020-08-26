import { TestingModule } from "@nestjs/testing";

import { Role } from "../../../entity/role/role_entity";
import { User } from "../../../entity/user/user_entity";
import { ForgotPasswordResolver } from "./forgot_password_resolver";
import { SendForgotPasswordInput, UpdatePasswordInput } from "../../user/dtos/forgot_password_input";
import { Permission } from "../../../entity/role/permission_entity";
import { IUserRepository } from "../../../lib/repositories/user/user.repository";
import { REPOSITORY } from "../../../lib/config/keys";
import { IForgotPasswordRepository } from "../../../lib/repositories/user/forgot_password.repository";
import { createTestingModule } from "../../../../test/test_container";
import { ForgotPasswordToken } from "../../../entity/user/forgot_password_entity";
import { EmailConfirmationToken } from "../../../entity/user/email_confirmation_entity";
import { EmailModule } from "../../../lib/emails/email.module";

describe("forgot password resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let resolver: ForgotPasswordResolver;
  let userRepository: IUserRepository;
  let forgotPasswordRepository: IForgotPasswordRepository;

  beforeEach(async () => {
    container = await createTestingModule(
      {
        imports: [EmailModule],
        providers: [ForgotPasswordResolver],
      },
      entities,
    );
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
    forgotPasswordRepository = container.get<IForgotPasswordRepository>(REPOSITORY.ForgotPasswordRepository);
    resolver = container.get(ForgotPasswordResolver);
  });

  describe("sendForgotPasswordEmail", () => {
    test("success", async () => {
      // arrange
      const user = await User.create({ email: "jason@raimondi.us" });
      user.isEmailConfirmed = true;
      await userRepository.save(user);

      // act
      const input = new SendForgotPasswordInput();
      input.email = user.email;
      await resolver.sendForgotPasswordEmail(input);

      // assert
      const updatedForgotPassword = await forgotPasswordRepository.findForUser(user.id);
      expect(updatedForgotPassword.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe("updatePasswordFromToken", () => {
    test("success", async () => {
      // arrange
      const user = await User.create({ email: "jason@raimondi.us" });
      user.isEmailConfirmed = true;
      await userRepository.save(user);
      const forgotPassword = new ForgotPasswordToken(user);
      await forgotPasswordRepository.save(forgotPassword);

      // act
      const input = new UpdatePasswordInput();
      input.token = forgotPassword.id;
      input.email = user.email;
      input.password = "my-new-password";
      await resolver.updatePasswordFromToken(input);

      // assert
      const updatedUser = await userRepository.findById(user.id);
      await expect(updatedUser.verify("my-new-password")).resolves.toBeUndefined();
      await expect(forgotPasswordRepository.findForUser(forgotPassword.id)).rejects.toThrowError(
        'Could not find any entity of type "ForgotPasswordToken"',
      );
    });
  });
});
