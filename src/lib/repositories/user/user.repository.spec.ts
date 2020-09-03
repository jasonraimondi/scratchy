import { User } from "~/entity/user/user_entity";
import { Role } from "~/entity/role/role_entity";
import { Permission } from "~/entity/role/permission_entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";
import { TestingModule } from "@nestjs/testing";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { REPOSITORY } from "~/lib/config/keys";
import { userGenerator } from "~test/generators/user.generator";

describe.skip("user_repository", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let userRepository: IUserRepository;
  let users: User[];

  beforeAll(async () => {
    container = await createTestingModule({}, entities,);
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
    users = [
      await userGenerator(),
      await userGenerator(),
      await userGenerator(),
      await userGenerator(),
      await userGenerator()
    ]
    for (const user of users) {
      await userRepository.save(user);
    }
  });

  test("limits are passed correctly", async () => {
    const { data, cursor } = await userRepository.list({ limit: 2 });
    console.log(users.map(user => user.id));

    expect(data[0].id).toBe("users[2].id")
    expect(cursor.beforeCursor).toBeNull();
    expect(typeof cursor.afterCursor === "string").toBeTruthy();
    expect(data.length).toBe(2);
  });
});