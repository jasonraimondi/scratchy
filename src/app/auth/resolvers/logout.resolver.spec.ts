import { TestingModule } from "@nestjs/testing";
import { AuthModule } from "~/app/auth/auth.module";

import { AuthService } from "~/app/auth/auth.service";
import { LogoutResolver } from "~/app/auth/resolvers/logout.resolver";
import { Permission } from "~/entity/role/permission.entity";
import { Role } from "~/entity/role/role.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";

describe("logout resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let userRepository: IUserRepository;
  let resolver: LogoutResolver;

  beforeAll(async () => {
    moduleRef = await createTestingModule({ imports: [AuthModule] }, entities);
    userRepository = moduleRef.get<IUserRepository>(REPOSITORY.UserRepository);
    resolver = moduleRef.get(LogoutResolver);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe("revokeRefreshToken", () => {
    test("fails for invalid user", async () => {
      // arrange
      const unsavedUser = await userGenerator({
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
      const user = await userGenerator();
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
