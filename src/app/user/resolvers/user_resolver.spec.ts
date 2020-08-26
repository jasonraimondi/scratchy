import { TestingModule } from "@nestjs/testing";

import { Role } from "../../../entity/role/role_entity";
import { User } from "../../../entity/user/user_entity";
import { Permission } from "../../../entity/role/permission_entity";
import { IUserRepository } from "../../../lib/repositories/user/user.repository";
import { REPOSITORY } from "../../../lib/config/keys";
import { UserResolver } from "./user_resolver";
import { createTestingModule } from "../../../../test/test_container";
import { ForgotPasswordToken } from "../../../entity/user/forgot_password_entity";
import { EmailConfirmationToken } from "../../../entity/user/email_confirmation_entity";


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
      const result = await resolver.user(user.id);

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
      await userRepository.save(await User.create({ email: "jason@raimondi.us" }));
      await userRepository.save(await User.create({ email: "jason1@raimondi.us" }));

      // act
      const result = await resolver.users();

      // assert
      expect(result.length).toBe(2);
    });
  });
});
