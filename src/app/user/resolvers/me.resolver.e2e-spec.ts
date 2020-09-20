import { GraphQLModule } from "@nestjs/graphql";
import { NestExpressApplication } from "@nestjs/platform-express";
import { TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AuthModule } from "~/app/auth/auth.module";
import { AuthService } from "~/app/auth/auth.service";

import { UserModule } from "~/app/user/user.module";
import { Permission } from "~/entity/role/permission.entity";
import { Role } from "~/entity/role/role.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { registerTypes } from "~/lib/helpers/register_types";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";
import { attachMiddlewares } from "~/lib/middlewares/attach_middlewares";

describe("me resolver", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let user: User;
  let app: NestExpressApplication;

  const meQuery = `
  query {
    me {
      id
      email
      isEmailConfirmed
    }
  }`;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [AuthModule, UserModule, GraphQLModule.forRoot({ autoSchemaFile: true })],
      },
      entities,
    );

    registerTypes();

    app = moduleRef.createNestApplication();
    attachMiddlewares(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleRef.close();
  });

  test("successfully returns user response", async () => {
    const userRepository = moduleRef.get<UserRepo>(UserRepo);
    const authService = moduleRef.get<AuthService>(AuthService);
    user = await userGenerator();
    await userRepository.save(user);

    await request(app.getHttpServer())
      .post("/graphql")
      .send({
        // operationName: null,
        query: meQuery,
      })
      .set("Authorization", `Bearer ${authService.createAccessToken(user)}`)
      .expect(({ body }) => {
        const data = body.data.me;
        expect(data).toBeTruthy();
        expect(data.id).toBe(user.id);
        expect(data.email).toBe(user.email);
        expect(data.isEmailConfirmed).toBe(user.isEmailConfirmed);
      })
      .expect(200)
      .expect("Content-Type", /json/);
  });

  test("blank authorization throws", async () => {
    await request(app.getHttpServer())
      .post("/graphql")
      .send({
        // operationName: null,
        query: meQuery,
      })
      .expect(({ body }) => {
        const errors = body.errors;
        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe("Unauthorized");
      })
      .expect(200)
      .expect("Content-Type", /json/);
  });
});
