import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import request from "supertest";

import { OauthModule } from "~/app/oauth/oauth.module";
import { AuthorizationCodeRepo } from "~/app/oauth/repositories/authorization_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { AuthorizationCode } from "~/app/oauth/entities/authorization_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { RefreshToken } from "~/app/oauth/entities/refresh_token.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { User } from "~/entity/user/user.entity";
import { attachMiddlewares } from "~/lib/middlewares/attach_middlewares";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";

describe("entities controller", () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  let client: Client;
  let user: User;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [OauthModule],
      },
      [AccessToken, RefreshToken, AuthorizationCode, Client, Scope],
    );

    const clientRepo = moduleRef.get(ClientRepo);
    const userRepo = moduleRef.get(UserRepo);

    user = await userRepo.create(await userGenerator());
    client = await clientRepo.create({
      name: "test client",
      secret: "f6ce22eb-5bf7-4de6-9017-a5383facbb49",
      redirectUris: ["http://localhost"],
      grants: ["authorization_code"],
    });

    app = moduleRef.createNestApplication();
    attachMiddlewares(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleRef.close();
  });

  test("authorize()", async () => {
    const response = await request(app.getHttpServer())
      .post("/entities/authorize")
      .query({
        response_type: "code",
        client_id: client.id,
        // client_secret: client.secret,
        redirect_uri: "http://localhost",
      })
      .expect(201)
      .expect("Content-Type", /json/);

    console.log(response.redirects);
    expect(response.redirects.length).toBe(1)
    expect(response).toBeTruthy();
    expect(response.body.message).toBe("password");
  });

  // test("token() authorization_code grant", async () => {
  //   const authCodeRepo = moduleRef.get(AuthorizationCodeRepo);
  //   const authCode = await authCodeRepo.create({ client: client, user, redirectUri: "http://localhost" });
  //   const response = await request(app.getHttpServer())
  //     .post("/entities/token")
  //     .set("Content-Type", "application/x-www-form-urlencoded")
  //     .send({
  //       grant_type: "authorization_code",
  //       client_id: client.id,
  //       client_secret: client.secret,
  //       code: authCode.token,
  //       redirect_uri: authCode.redirectUri,
  //     })
  //     .expect(201)
  //     .expect("Content-Type", /json/);
  //
  //   console.log(response);
  //
  //   expect(response).toBeTruthy();
  //   expect(response.body.access_token).toBeTruthy();
  //   expect(response.body.token_type).toBe("Bearer");
  //   expect(response.body.expires_in).toBeTruthy();
  // });

  // test("token() password grant", async () => {
  //   const response = await request(app.getHttpServer())
  //     .post("/entities/token")
  //     .set("Content-Type", "application/x-www-form-urlencoded")
  //     .send({
  //       grant_type: "password",
  //       username: user.email,
  //       password: user.password,
  //       scope: null,
  //       client_id: client.id,
  //       client_secret: client.secret,
  //       redirect_uri: "http://localhost",
  //     })
  //     .expect(201)
  //     .expect("Content-Type", /json/);
  //
  //   expect(response).toBeTruthy();
  //   expect(response.body.access_token).toBeTruthy();
  //   expect(response.body.token_type).toBe("Bearer");
  //   expect(response.body.expires_in).toBeTruthy();
  // });
});
