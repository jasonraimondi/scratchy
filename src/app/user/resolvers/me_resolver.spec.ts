import { TestingModule } from "@nestjs/testing";
import { User } from "../../../entity/user/user_entity";
import { MeResolver } from "./me_resolver";
import { IUserRepository } from "../../../lib/repositories/user/user.repository";
import { createTestingModule } from "../../../../test/test_container";
import { Role } from "../../../entity/role/role_entity";
import { MyContext } from "../../../lib/types/my_context";
import { Permission } from "../../../entity/role/permission_entity";
import { REPOSITORY } from "../../../lib/config/keys";
import { UserResolver } from "./user_resolver";
import { ForgotPasswordToken } from "../../../entity/user/forgot_password_entity";
import { EmailConfirmationToken } from "../../../entity/user/email_confirmation_entity";
import { mockRequest, mockResponse } from "../../../../test/mock_application";

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
