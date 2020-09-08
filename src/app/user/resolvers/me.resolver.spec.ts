import { TestingModule } from "@nestjs/testing";

import { MeResolver } from "~/app/user/resolvers/me.resolver";
import { UserModule } from "~/app/user/user.module";
import { Permission } from "~/entity/role/permission.entity";
import { Role } from "~/entity/role/role.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/config/my_context";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";
import { mockContext } from "~test/mock_application";

describe("me resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let context: MyContext;
  let resolver: MeResolver;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [UserModule],
      },
      entities,
    );
    resolver = moduleRef.get(MeResolver);
  });

  test("successfully returns user response", async () => {
    const userRepository = moduleRef.get<IUserRepository>(REPOSITORY.UserRepository);
    const user = await userGenerator();
    await userRepository.save(user);

    context = mockContext({
      container: moduleRef,
      auth: {
        userId: user.id,
        email: user.email,
        isEmailConfirmed: user.isEmailConfirmed,
      },
    });

    // act
    const result: User | null = await resolver.me(context);

    // assert
    expect(result).toBeTruthy();
    expect(result!.id).toBe(user.id);
    expect(result!.email).toBe(user.email);
    expect(result!.isEmailConfirmed).toBe(user.isEmailConfirmed);
  });

  test("blank authorization throws", async () => {
    context = mockContext({ container: moduleRef });

    // act
    const result = resolver.me(context);

    // assert
    await expect(result).rejects.toThrowError(/Cannot read property 'userId' of undefined/);
  });
});
