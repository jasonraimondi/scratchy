import { TestingModule } from "@nestjs/testing";

import { Role } from "../../../entity/role/role_entity";
import { ForgotPasswordToken } from "../../../entity/user/forgot_password_entity";
import { MyContext } from "../../../lib/types/my_context";
import { mockRequest, mockResponse } from "../../../../test/mock_application";
import { User } from "../../../entity/user/user_entity";
import { EmailConfirmationToken } from "../../../entity/user/email_confirmation_entity";
import { Permission } from "../../../entity/role/permission_entity";
import { IUserRepository } from "../../../lib/repositories/user/user.repository";
import { REPOSITORY } from "../../../lib/config/keys";
import { LogoutResolver } from "./logout_resolver";
import { createTestingModule } from "../../../../test/test_container";

describe("auth_resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let userRepository: IUserRepository;
  let context: MyContext;
  let resolver: LogoutResolver;

  beforeEach(async () => {
    container = await createTestingModule(
      {
        providers: [LogoutResolver],
      },
      entities,
    );
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
    context = {
      res: mockRequest(),
      req: mockResponse(),
      container,
    };
    resolver = container.get(LogoutResolver);
  });

  describe("revokeRefreshToken", () => {
    test("fails for invalid user", async () => {
      // arrange
      const unsavedUser = await User.create({
        email: "control_user@example.com",
      });

      // act
      const result = await resolver.revokeRefreshToken(unsavedUser.id);

      // assert
      expect(result).toBeFalsy();
      expect(unsavedUser.tokenVersion).toBe(0);
    });

    test("increments the user token version", async () => {
      // arrange
      const user = await User.create({ email: "jason@raimondi.us" });
      await userRepository.save(user);

      // act
      const result = await resolver.revokeRefreshToken(user.id);

      // assert
      const updatedUser = await userRepository.findByEmail(user.email);
      expect(result).toBeTruthy();
      expect(updatedUser.tokenVersion).toBe(1);
    });
  });
});
