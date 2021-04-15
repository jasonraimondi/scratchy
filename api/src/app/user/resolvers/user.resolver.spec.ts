import { TestingModule } from "@nestjs/testing";

import { UserResolver } from "~/app/user/resolvers/user.resolver";
import { UserModule } from "~/app/user/user.module";
import { Permission } from "~/entities/permission.entity";
import { Role } from "~/entities/role.entity";
import { EmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entities/forgot_password.entity";
import { User } from "~/entities/user.entity";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { generateUser } from "~test/generators/generateUser";

describe("register resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let userRepository: UserRepository;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [UserModule],
      },
      entities,
    );
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe("user", () => {
    test("resolve user by id", async () => {
      // arrange
      const resolver = moduleRef.get<UserResolver>(UserResolver);
      const user = await generateUser();
      await userRepository.create(user);

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
      await userRepository.create(await generateUser());
      await userRepository.create(await generateUser());
      await userRepository.create(await generateUser());

      // act
      const result = await resolver.users({ limit: 2 });

      // assert
      expect(result.cursor.beforeCursor).toBeNull();
      expect(result.cursor.afterCursor).toBeTruthy();
      expect(result.data.length).toBe(2);
    });
  });
});
