import { TestingModule } from "@nestjs/testing";

import { Permission } from "~/entity/role/permission.entity";
import { Role } from "~/entity/role/role.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/lib/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";

describe.skip("user_repository", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let userRepository: IUserRepository;
  let users: User[];

  beforeAll(async () => {
    container = await createTestingModule({}, entities);
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
    users = [
      await userGenerator(),
      await userGenerator(),
      await userGenerator(),
      await userGenerator(),
      await userGenerator(),
    ];
    for (const user of users) {
      await userRepository.save(user);
    }
  });

  test("limits are passed correctly", async () => {
    const { data, cursor } = await userRepository.list({ limit: 2 });
    console.log(users.map((user) => user.id));

    expect(data[0].id).toBe("users[2].id");
    expect(cursor.beforeCursor).toBeNull();
    expect(typeof cursor.afterCursor === "string").toBeTruthy();
    expect(data.length).toBe(2);
  });
});
