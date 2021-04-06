import { GraphQLModule } from "@nestjs/graphql";
import { NestExpressApplication } from "@nestjs/platform-express";
import { TestingModule } from "@nestjs/testing";
import request from "supertest";

import { AccountModule } from "../../src/app/account/account.module";
import { UserModule } from "../../src/app/user/user.module";
import { Permission } from "../../src/app/user/entities/permission.entity";
import { Role } from "../../src/app/user/entities/role.entity";
import { User } from "../../src/app/user/entities/user.entity";
import { registerTypes } from "../../src/lib/database/register_types";
import { UserRepository } from "../../src/lib/database/repositories/user.repository";
import { createTestingModule } from "../app_testing.module";
import { generateUser } from "../generators/generateUser";
import { attachMiddlewares } from "../../src/lib/middlewares/attach_middlewares";
import { ForgotPasswordToken } from "../../src/app/account/entities/forgot_password.entity";
import { EmailConfirmationToken } from "../../src/app/account/entities/email_confirmation.entity";
import { MeResolver } from "../../src/app/user/resolvers/me.resolver";

describe.skip(MeResolver, () => {
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
        imports: [AccountModule, UserModule, GraphQLModule.forRoot({ autoSchemaFile: true })],
      },
      entities,
    );

    registerTypes();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleRef.close();
  });

  test("successfully returns user response", async () => {
    const userRepository = moduleRef.get<UserRepository>(UserRepository);
    user = await generateUser();
    await userRepository.save(user);

    const http = app.getHttpServer();

    await request(http)
      .post("/graphql")
      .send({
        // operationName: null,
        query: meQuery,
      })
      .set("Authorization", `Bearer ${"authService.createAccessToken(user)"}`)
      .expect(({ body, status }) => {
        console.log({ body }, body.errors);
        const data = body.data.me;
        expect(status).toBe(200);
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
