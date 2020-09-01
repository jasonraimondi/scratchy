import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import request from "supertest";

import { Role } from "~/entity/role/role_entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import { User } from "~/entity/user/user_entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";
import { AuthService } from "~/app/auth/auth.service";
import { Permission } from "~/entity/role/permission_entity";
import { AuthController } from "~/app/auth/auth.controller";
import { createTestingModule } from "~/app/app_testing.module";

const entities = [EmailConfirmationToken, User, Role, Permission, ForgotPasswordToken];

describe("Auth Controller", () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule(
      {
        controllers: [AuthController],
        providers: [AuthService],
      },
      entities,
    );

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/POST auth/refresh_token", () => {
    it("throws 401 if no refresh token cookie", () => {
      return request(app.getHttpServer()).post("/auth/refresh_token").expect(401);
    });

    // @todo add test for valid post
  });
});
