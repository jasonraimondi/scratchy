import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import request from "supertest";

import { Role } from "~/entity/role/role.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { AuthService } from "~/app/auth/auth.service";
import { Permission } from "~/entity/role/permission.entity";
import { AuthController } from "~/app/auth/auth.controller";
import { createTestingModule } from "~test/app_testing.module";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { REPOSITORY } from "~/lib/config/keys";
import cookieParser from "cookie-parser";
import { userGenerator } from "~test/generators/user.generator";

const entities = [EmailConfirmationToken, User, Role, Permission, ForgotPasswordToken];

describe("Auth Controller", () => {
  let app: INestApplication;
  let module: TestingModule;
  let authService: AuthService;
  let userRepository: IUserRepository;

  beforeAll(async () => {
    module = await createTestingModule(
      {
        controllers: [AuthController],
        providers: [AuthService],
      },
      entities,
    );
    authService = module.get(AuthService);
    userRepository = module.get(REPOSITORY.UserRepository);
    app = module.createNestApplication();
    // @todo refactor out app.use https://github.com/jasonraimondi/graphql-server/blob/master/packages/api/src/lib/express.ts
    app.use(cookieParser())
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("refresh token updates successfully", async () => {
    // arrange
    const user = await userGenerator();
    await userRepository.save(user);
    const refreshToken = authService.createRefreshToken(user);

    // act
    const response = await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .expect(201)
      .set("Cookie", [`jid=${refreshToken}`, `rememberMe=true`])
      .expect("Content-Type", /json/);

    // assert
    expect(response.header["set-cookie"].length).toBe(2);
    expect(response.header["set-cookie"][0]).toMatch(/rememberMe=true*/);
    const REFRESH_COOKIE = /jid=[a-zA-Z\d\-_]+.[a-zA-Z\d\-_]+.[a-zA-Z\d\-_]+; Domain=localhost; Path=\/;/;
    expect(response.header["set-cookie"][1]).toMatch(REFRESH_COOKIE);
    expect(response.body.success).toBe(true);
    expect(response.body.accessToken).toMatch(/[a-zA-Z\d]+.[a-zA-Z\d]+.[a-zA-Z\d]+/);
  });

  test("refresh token no remember me", async () => {
    // arrange
    const user = await userGenerator();
    await userRepository.save(user);
    const refreshToken = authService.createRefreshToken(user);

    // act
    const response = await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .expect(201)
      .set("Cookie", [`jid=${refreshToken}`])
      .expect("Content-Type", /json/);

    // assert
    expect(response.header["set-cookie"][0]).toMatch(/rememberMe=false*/);
  });

  test("missing token (jid) fails", async () => {
    // act
    const response = await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .expect(401)
      .expect("Content-Type", /json/);

    // assert
    expect(response.header["set-cookie"]).toBeUndefined();
    expect(response.body.success).toBe(false);
    expect(response.body.accessToken).toBe("");
  });

  test("invalid token (jid) fails", async () => {
    // arrange
    const invalidToken = "invalid-token";

    // act
    const response = await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .expect(401)
      .set("Cookie", [`jid=${invalidToken}`])
      .expect("Content-Type", /json/);

    // assert
    expect(response.header["set-cookie"]).toBeUndefined();
    expect(response.body.success).toBe(false);
    expect(response.body.accessToken).toBe("");
  });
});
