import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import request from "supertest";

import { OAuthModule } from "~/app/oauth/oauth.module";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { AuthorizationCode } from "~/app/oauth/entities/authorization_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { RefreshToken } from "~/app/oauth/entities/refresh_token.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { attachMiddlewares } from "~/lib/middlewares/attach_middlewares";
import { base64encode } from "~/lib/utils/base64";
import { createTestingModule } from "~test/app_testing.module";

describe("oauth controller", () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  let client: Client;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [OAuthModule],
      },
      [AccessToken, RefreshToken, AuthorizationCode, Client, Scope],
    );

    const clientRepo = moduleRef.get(ClientRepo);
    const scopeRepo = moduleRef.get(ScopeRepo);

    client = await clientRepo.create({
      name: "test client",
      secret: "f6ce22eb-5bf7-4de6-9017-a5383facbb49",
      redirectUris: ["http://localhost"],
    });

    await scopeRepo.create({ name: "scope-1" });
    await scopeRepo.create({ name: "scope-2" });

    app = moduleRef.createNestApplication();
    attachMiddlewares(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleRef.close();
  });

  test("client_credentials with ", () => {
    const basicAuth = "Basic " + base64encode(`${client.id}:${client.secret}`);

    return request(app.getHttpServer())
      .post("/oauth2/access_token")
      .set("Authorization", basicAuth)
      .send({
        grant_type: "client_credentials",
        scopes: ["scope-1", "scope-2"],
      })
      .expect((response) => {
        const { token_type, expires_in, access_token } = response.body;
        expect(token_type).toBe("Bearer");
        expect(expires_in).toBe(3600);
        expect(access_token).toBeTruthy();
        expect(access_token.split(".").length).toBe(3);
      })
      .expect(201)
      .expect("Content-Type", /json/);
  });

  test("client_credentials with creds in body", () => {
    return request(app.getHttpServer())
      .post("/oauth2/access_token")
      .send({
        grant_type: "client_credentials",
        client_id: client.id,
        client_secret: client.secret,
        scopes: ["scope-1"],
      })
      .expect((response) => {
        const { token_type, expires_in, access_token } = response.body;
        expect(token_type).toBe("Bearer");
        expect(expires_in).toBe(3600);
        expect(access_token).toBeTruthy();
        expect(access_token.split(".").length).toBe(3);
      })
      .expect(201)
      .expect("Content-Type", /json/);
  });
});
