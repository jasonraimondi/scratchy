import jwtDecode from "jwt-decode";

describe("login_resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingContainer;
  let userRepository: IUserRepository;
  let context: MyContext;
  let resolver: AuthResolver;

  beforeEach(async () => {
    container = await TestingContainer.create(entities);
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
    context = {
      res: mockRequest(),
      req: mockResponse(),
      container,
    };
    resolver = container.get(AuthResolver);
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
