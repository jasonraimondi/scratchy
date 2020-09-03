import { TestingModule } from "@nestjs/testing";

import { Role } from "~/entity/role/role_entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import { User } from "~/entity/user/user_entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";
import { Permission } from "~/entity/role/permission_entity";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { REPOSITORY } from "~/lib/config/keys";
import { UserResolver } from "~/app/user/resolvers/user_resolver";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";

describe("register_resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    container = await createTestingModule(
      {
        providers: [UserResolver],
      },
      entities,
    );
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
  });

  describe("user", () => {
    test("resolve user by id", async () => {
      // arrange
      const resolver = container.get<UserResolver>(UserResolver);
      const user = await User.create({ email: "jason@raimondi.us" });
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
      const resolver = container.get<UserResolver>(UserResolver);
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
