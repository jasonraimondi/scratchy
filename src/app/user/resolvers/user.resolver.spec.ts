import { TestingModule } from "@nestjs/testing";

import { UserResolver } from "~/app/user/resolvers/user.resolver";
import { UserModule } from "~/app/user/user.module";
import { Permission } from "~/entity/role/permission.entity";
import { Role } from "~/entity/role/role.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";

describe("register resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let userRepository: UserRepo;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [UserModule],
      },
      entities,
    );
    userRepository = moduleRef.get<UserRepo>(UserRepo);
  });

  describe("user", () => {
    test("resolve user by id", async () => {
      // arrange
      const resolver = moduleRef.get<UserResolver>(UserResolver);
      const user = await userGenerator();
      await userRepository.save(user);

      // act
      const result = await resolver.user(user.email);

      // assert
      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
      expect(result.firstName).toBe(user.firstName);
    });
  });

  describe("users", () => {
    test("resolve list users", async () => {
      // arrange
      const resolver = moduleRef.get<UserResolver>(UserResolver);
      await userRepository.save(await userGenerator());
      await userRepository.save(await userGenerator());
      await userRepository.save(await userGenerator());

      // act
      const result = await resolver.users({ limit: 2 });

      // assert
      expect(result.cursor.beforeCursor).toBeNull();
      expect(result.cursor.afterCursor).toBeTruthy();
      expect(result.data.length).toBe(2);
    });
  });
});
