import { TestingModule } from "@nestjs/testing";

import { Role } from "~/entity/role/role.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { MyContext } from "~/lib/types/my_context";
import { mockRequest, mockResponse } from "~test/mock_application";
import { User } from "~/entity/user/user.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { MeResolver } from "~/app/user/resolvers/me.resolver";
import { Permission } from "~/entity/role/permission.entity";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { REPOSITORY } from "~/lib/config/keys";
import { createTestingModule } from "~test/app_testing.module";

describe("me resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let context: MyContext;
  let resolver: MeResolver;

  beforeEach(async () => {
    container = await createTestingModule(
      {
        providers: [MeResolver],
      },
      entities,
    );
    context = {
      req: mockRequest(),
      res: mockResponse(),
      container,
    };
    resolver = container.get(MeResolver);
  });

  test("successfully returns user response", async () => {
    const userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
    const user = await User.create({ email: "jason@raimondi.us" });
    await userRepository.save(user);

    context = {
      req: mockRequest(),
      res: mockResponse(),
      container,
      auth: {
        userId: user.id,
        email: user.email,
        isEmailConfirmed: user.isEmailConfirmed,
      },
    };

    // act
    const result: User | null = await resolver.me(context);

    // assert
    expect(result).toBeTruthy();
    expect(result!.id).toBe(user.id);
    expect(result!.email).toBe(user.email);
    expect(result!.isEmailConfirmed).toBe(user.isEmailConfirmed);
  });

  test("blank authorization throws", async () => {
    context = {
      req: mockRequest(),
      res: mockResponse(),
      container,
    };

    // act
    const result = resolver.me(context);

    // assert
    await expect(result).rejects.toThrowError(/Cannot read property 'userId' of undefined/);
  });
});
