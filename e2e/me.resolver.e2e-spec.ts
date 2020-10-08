import { GraphQLModule } from "@nestjs/graphql";
import { NestExpressApplication } from "@nestjs/platform-express";
import { TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AuthModule } from "../src/app/auth/auth.module";

import { UserModule } from "../src/app/user/user.module";
import { Permission } from "../src/entity/role/permission.entity";
import { Role } from "../src/entity/role/role.entity";
import { EmailConfirmationToken } from "../src/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "../src/entity/user/forgot_password.entity";
import { User } from "../src/entity/user/user.entity";
import { registerTypes } from "../src/lib/helpers/register_types";
import { UserRepo } from "../src/lib/repositories/user/user.repository";
import { createTestingModule } from "../test/app_testing.module";
import { userGenerator } from "../test/generators/user.generator";
import { attachMiddlewares } from "../src/lib/middlewares/attach_middlewares";

describe.skip("me resolver", () => {
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
    user = await userGenerator();
    await userRepository.save(user);

    await request(app.getHttpServer())
      .post("/graphql")
      .send({
        // operationName: null,
        query: meQuery,
      })
      .set("Authorization", `Bearer ${"authService.createAccessToken(user)"}`)
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
