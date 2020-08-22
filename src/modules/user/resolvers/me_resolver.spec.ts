import { User } from "../../entity/user/user_entity";
import { Role } from "../../entity/role/role_entity";
import { Permission } from "../../entity/role/permission_entity";
import { ForgotPassword } from "../../entity/user/forgot_password_entity";
import { EmailConfirmation } from "../../entity/user/email_confirmation_entity";
import { TestingContainer } from "../../../test/test_container";
import { MyContext } from "../../lib/types/my_context";
import { MeResolver } from "./me_resolver";
import { REPOSITORY } from "../../lib/constants/inversify";
import { IUserRepository } from "../../lib/repository/user/user_repository";
import { mockRequest, mockResponse } from "../../../test/mock_application";

describe("me resolver", () => {
  const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

  let container: TestingContainer;
  let context: MyContext;
  let resolver: MeResolver;

  beforeEach(async () => {
    container = await TestingContainer.create(entities);
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
