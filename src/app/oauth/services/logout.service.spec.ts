import { TestingModule } from "@nestjs/testing";

import { LogoutService } from "~/app/oauth/services/logout.service";
import { Permission } from "~/app/user/entities/permission.entity";
import { Role } from "~/app/user/entities/role.entity";
import { EmailConfirmationToken } from "~/app/account/entities/email_confirmation.entity";
import { ForgotPasswordToken } from "~/app/account/entities/forgot_password.entity";
import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";
import { OAuthModule } from "../oauth.module";

describe.skip("logout resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let userRepository: UserRepo;
  let resolver: LogoutService;

  beforeAll(async () => {
    moduleRef = await createTestingModule({ imports: [OAuthModule] }, entities);
    userRepository = moduleRef.get<UserRepo>(UserRepo);
    resolver = moduleRef.get(LogoutService);
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
