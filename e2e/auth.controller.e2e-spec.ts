import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import request from "supertest";

import { AuthModule } from "../src/app/auth/auth.module";
import { AuthService } from "../src/app/auth/auth.service";
import { Permission } from "../src/entity/role/permission.entity";
import { Role } from "../src/entity/role/role.entity";
import { EmailConfirmationToken } from "../src/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "../src/entity/user/forgot_password.entity";
import { User } from "../src/entity/user/user.entity";
import { attachMiddlewares } from "../src/lib/middlewares/attach_middlewares";
import { UserRepo } from "../src/lib/repositories/user/user.repository";
import { createTestingModule } from "../test/app_testing.module";
import { userGenerator } from "../test/generators/user.generator";

const entities = [EmailConfirmationToken, User, Role, Permission, ForgotPasswordToken];

describe("auth controller", () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let authService: AuthService;
  let userRepository: UserRepo;

  beforeAll(async () => {
    moduleRef = await createTestingModule({ imports: [AuthModule] }, entities);
    authService = moduleRef.get(AuthService);
    userRepository = moduleRef.get(UserRepo);
    app = moduleRef.createNestApplication();
    attachMiddlewares(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleRef.close();
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
