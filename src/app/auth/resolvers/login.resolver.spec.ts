import { TestingModule } from "@nestjs/testing";
import jwtDecode from "jwt-decode";
import { AuthModule } from "~/app/auth/auth.module";

import { LoginResolver } from "~/app/auth/resolvers/login.resolver";
import { LoginInput } from "~/app/user/dtos/login.input";
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

describe("login resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let userRepository: IUserRepository;
  let context: MyContext;
  let resolver: LoginResolver;

  beforeAll(async () => {
    moduleRef = await createTestingModule({ imports: [AuthModule] }, entities);
    userRepository = moduleRef.get<IUserRepository>(REPOSITORY.UserRepository);
    context = mockContext();
    resolver = moduleRef.get(LoginResolver);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  test("user logs in successfully", async () => {
    // arrange
    const input = new LoginInput();
    input.email = "jason@Raimondi.us";
    input.password = "jasonraimondi";
    const user = await userGenerator(input);
    user.isEmailConfirmed = true;
    await userRepository.save(user);

    // act
    const result = await resolver.login(input, context);

    // assert
    const decode = jwtDecode<any>(result.accessToken);
    expect(decode.userId).toBe(user.id);
    expect(result.user.id).toBe(user.id);
    expect(result.user.email).toBe(user.email);
    expect(context.res.cookies.length).toBe(2);
    const [name, value] = context.res.cookies[1];
    expect(name).toBe("jid");
    expect(value).toMatch(/[a-zA-Z]/);
  });

  test("user without password throws error", async () => {
    // arrange
    const user = await userGenerator({ password: undefined });
    await userRepository.save(user);
    const input = new LoginInput();
    input.email = user.email;
    input.password = "non-existant-password";

    // act
    const result = resolver.login(input, context);

    // assert
    await expect(result).rejects.toThrowError("user must create password");
  });

  test("non existant user throws", async () => {
    // arrange
    const input = new LoginInput();
    input.email = "emails@notfound.com";
    input.password = "thisuserdoesntexist";

    // act
    const result = resolver.login(input, context);

    // assert
    await expect(result).rejects.toThrowError(new RegExp('Could not find any entity of type "User"'));
  });
});
