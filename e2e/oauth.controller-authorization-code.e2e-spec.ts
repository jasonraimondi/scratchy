import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import * as querystring from "querystring";
import request from "supertest";

import { OAuthModule } from "../src/app/oauth/oauth.module";
import { ClientRepo } from "../src/app/oauth/repositories/client.repository";
import { AccessToken } from "../src/app/oauth/entities/access_token.entity";
import { AuthCode } from "../src/app/oauth/entities/auth_code.entity";
import { Client } from "../src/app/oauth/entities/client.entity";
import { RefreshToken } from "../src/app/oauth/entities/refresh_token.entity";
import { Scope } from "../src/app/oauth/entities/scope.entity";
import { ScopeRepo } from "../src/app/oauth/repositories/scope.repository";
import { attachMiddlewares } from "../src/lib/middlewares/attach_middlewares";
import { base64encode } from "../src/lib/utils/base64";
import { createTestingModule } from "../test/app_testing.module";

describe("oauth2 authorization_code e2e", () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  let client: Client;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [OAuthModule],
      },
      [AccessToken, RefreshToken, AuthCode, Client, Scope],
    );

    const clientRepo = moduleRef.get(ClientRepo);
    const scopeRepo = moduleRef.get(ScopeRepo);

    client = await clientRepo.create(
      new Client({
        name: "test client",
        secret: "f6ce22eb-5bf7-4de6-9017-a5383facbb49",
        redirectUris: ["http://localhost"],
        allowedGrants: ["client_credentials"],
      }),
    );

    await scopeRepo.create(new Scope({ name: "scope-1" }));
    await scopeRepo.create(new Scope({ name: "scope-2" }));

    app = moduleRef.createNestApplication();
    attachMiddlewares(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleRef.close();
  });

  it("allows auth code grant", () => {
    return request(app.getHttpServer())
      .get("/oauth2/authorize")
      .query({
        response_type: "client_credentials",
        client_id: client.id,
        redirect_uri: "http://localhost",
        scope: "scope-1 scope-2",
        state: "state-is-a-secret",
      })
      .expect(302)
      // .expect("Content-Type", /json/)
      .expect('Location', new RegExp(client.redirectUris[0]))
      .expect((response) => {
        const { location } = response.headers;
        expect(typeof location === "string").toBeTruthy()
        const parsed = querystring.parse(location)
        console.log(parsed)
        expect(location).toMatch(/http\:\/\/localhost/)
        expect(parsed.state).toBe("state-is-a-secret")
      });
  });
});
