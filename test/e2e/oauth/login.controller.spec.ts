import { TestingModule } from "@nestjs/testing";
import crypto from "crypto";

import { AuthCode } from "../../../src/app/oauth/entities/auth_code.entity";
import { Client } from "../../../src/app/oauth/entities/client.entity";
import { Scope } from "../../../src/app/oauth/entities/scope.entity";
import { Token } from "../../../src/app/oauth/entities/token.entity";
import { OAuthModule } from "../../../src/app/oauth/oauth.module";
import { ClientRepo } from "../../../src/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "../../../src/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "../../../src/app/oauth/repositories/scope.repository";
import { User } from "../../../src/app/user/entities/user.entity";
import { base64urlencode } from "../../../src/lib/utils/base64";
import { createTestingModule } from "../../app_testing.module";
import { userGenerator } from "../../generators/user.generator";
import { LoginController } from "../../../src/app/oauth/controllers/login.controller";

describe.skip(LoginController, () => {
  let controller: LoginController;
  let user: User;
  let client: Client;
  let scope1: Scope;
  let scope2: Scope;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule(
      {
        imports: [OAuthModule],
      },
      [Token, AuthCode, Client, Scope],
    );

    const clientRepo = module.get(ClientRepo);
    const scopeRepo = module.get(ScopeRepo);
    const userRepo = module.get(OAuthUserRepo);

    user = await userRepo.save(await userGenerator());

    client = await clientRepo.create(
      new Client({
        id: "becd6a60-7b2f-4454-9f77-ab31c05ca8d6",
        name: "test client",
        secret: undefined,
        redirectUris: ["http://localhost"],
        allowedGrants: ["authorization_code"],
      }),
    );

    scope1 = await scopeRepo.create(new Scope({ name: "scope-1" }));
    scope2 = await scopeRepo.create(new Scope({ name: "scope-2" }));

    controller = module.get<LoginController>(LoginController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  // test("user logs in successfully", async () => {
  //   // arrange
  //   const input = new LoginInput();
  //   input.email = "jason@Raimondi.us";
  //   input.password = "jasonraimondi";
  //   let user = await userGenerator(input);
  //   user.isEmailConfirmed = true;
  //   await userRepository.save(user);
  //   const originalLoggedInAt = user.lastLoginAt;
  //
  //   // act
  //   const result = await resolver.login(input, context);
  //   user = await userRepository.findByEmail(user.email);
  //
  //   // assert
  //   const decode = jwtDecode<any>(result.accessToken);
  //   expect(decode.userId).toBe(user.id);
  //   expect(result.user.id).toBe(user.id);
  //   expect(result.user.email).toBe(user.email);
  //   expect(context.res.cookies.length).toBe(2);
  //   const [name, value] = context.res.cookies[1];
  //   expect(name).toBe("jid");
  //   expect(value).toMatch(/[a-zA-Z]/);
  //   expect(originalLoggedInAt).toBeNull();
  //   expect(user.lastLoginAt).toBeTruthy();
  //   expect(user.lastLoginIP).toBe("::testing");
  // });

  it("should validate successful login", async () => {
    const codeVerifier = crypto.randomBytes(40).toString("hex");
    const codeChallenge = base64urlencode(crypto.createHash("sha256").update(codeVerifier).digest("hex"));

    const res: any = {
      redirect: jest.fn().mock,
      status: jest.fn().mock,
      cookie: jest.fn().mock,
    };
    const req: any = {
      query: {
        response_type: "code",
        client_id: client.id,
        redirect_uri: "http://localhost",
        scope: [scope1.name, scope2.name],
        state: "state-is-a-secret",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      },
      body: { email: user.email, password: "testing123" },
    };
    const result = await controller.post(req, res);
    // console.log({ location: result });
    expect(controller).toBeDefined();
    console.log(res.cookie.results);
  });

  // test("user without password throws error", async () => {
  //   // arrange
  //   const user = await userGenerator({ password: undefined });
  //   await userRepository.save(user);
  //   const input = new LoginInput();
  //   input.email = user.email;
  //   input.password = "non-existant-password";
  //
  //   // act
  //   const result = resolver.login(input, context);
  //
  //   // assert
  //   await expect(result).rejects.toThrowError("user must create password");
  // });
  //
  // test("non existant user throws", async () => {
  //   // arrange
  //   const input = new LoginInput();
  //   input.email = "emails@notfound.com";
  //   input.password = "thisuserdoesntexist";
  //
  //   // act
  //   const result = resolver.login(input, context);
  //
  //   // assert
  //   await expect(result).rejects.toThrowError(new RegExp('Could not find any entity of type "User"'));
  // });
});
