import jwtDecode from "jwt-decode";

import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { TestingModule } from "@nestjs/testing";
import { User } from "~/entity/user/user.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { LoginInput } from "~/app/user/dtos/login.input";
import { Role } from "~/entity/role/role.entity";
import { MyContext } from "~/lib/types/my_context";
import { LoginResolver } from "~/app/auth/resolvers/login.resolver";
import { AuthService } from "~/app/auth/auth.service";
import { Permission } from "~/entity/role/permission.entity";
import { mockContext } from "~test/mock_application";
import { REPOSITORY } from "~/lib/config/keys";

describe("login.resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let userRepository: IUserRepository;
  let context: MyContext;
  let resolver: LoginResolver;

  beforeEach(async () => {
    container = await createTestingModule(
      {
        providers: [LoginResolver, AuthService],
      },
      entities,
    );
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
    context = mockContext({ container });
    resolver = container.get(LoginResolver);
  });

  test("user logs in successfully", async () => {
    // arrange
    const input = new LoginInput();
    input.email = "jason@Raimondi.us";
    input.password = "jasonraimondi";
    const user = await User.create(input);
    user.isEmailConfirmed = true;
    await userRepository.save(user);

    // act
    const result = await resolver.login(input, context);

    // assert
    const decode = jwtDecode<any>(result.accessToken);
    expect(decode.userId).toBe(user.id);
    expect(result.user.id).toBe(user.id);
    expect(result.user.email).toBe(user.email);
  });

  test("user without password throws error", async () => {
    // arrange
    await userRepository.save(await User.create({ email: "jason@raimondi.us" }));
    const input = new LoginInput();
    input.email = "jason@raimondi.us";
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
