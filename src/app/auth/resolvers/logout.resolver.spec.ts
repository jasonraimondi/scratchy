import { TestingModule } from "@nestjs/testing";

import { Role } from "~/entity/role/role.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { AuthService } from "~/app/auth/auth.service";
import { Permission } from "~/entity/role/permission.entity";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { REPOSITORY } from "~/lib/config/keys";
import { createTestingModule } from "~test/app_testing.module";
import { LogoutResolver } from "~/app/auth/resolvers/logout.resolver";

describe("auth.resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let userRepository: IUserRepository;
  let resolver: LogoutResolver;

  beforeEach(async () => {
    container = await createTestingModule(
      {
        providers: [LogoutResolver, AuthService],
      },
      entities,
    );
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
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
