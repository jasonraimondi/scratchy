import { Permission } from "../../entity/role/permission_entity";
import { Role } from "../../entity/role/role_entity";
import { EmailConfirmation } from "../../entity/user/email_confirmation_entity";
import { ForgotPassword } from "../../entity/user/forgot_password_entity";
import { User } from "../../entity/user/user_entity";
import { REPOSITORY } from "../../lib/constants/inversify";
import { IForgotPasswordRepository } from "../../lib/repository/user/forgot_password_repository";
import { IUserRepository } from "../../lib/repository/user/user_repository";
import { TestingContainer } from "../../../test/test_container";
import { SendForgotPasswordInput, UpdatePasswordInput } from "./dtos/forgot_password_input";
import { ForgotPasswordResolver } from "./forgot_password_resolver";

describe("forgot password resolver", () => {
  const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

  let container: TestingContainer;
  let resolver: ForgotPasswordResolver;
  let userRepository: IUserRepository;
  let forgotPasswordRepository: IForgotPasswordRepository;

  beforeEach(async () => {
    container = await TestingContainer.create(entities);
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
      const forgotPassword = new ForgotPassword(user);
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
        'Could not find any entity of type "ForgotPassword"',
      );
    });
  });
});
