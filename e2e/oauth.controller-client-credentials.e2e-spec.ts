import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
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

describe("oauth2 client_credentials e2e", () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  let client: Client;
  let clientNoClientCredentialsAllowed: Client;

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

    clientNoClientCredentialsAllowed = await clientRepo.create(
      new Client({
        name: "disallow-client-credentials",
        secret: "f6ce22eb-5bf7-4de6-9017-a5383facbb49",
        redirectUris: ["http://localhost"],
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

  it("allows client credentials as basicAuth header", () => {
    const basicAuth = "Basic " + base64encode(`${client.id}:${client.secret}`);
    return request(app.getHttpServer())
      .post("/oauth2/access_token")
      .set("Authorization", basicAuth)
      .send({
        grant_type: "client_credentials",
        scopes: ["scope-1", "scope-2"],
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .expect((response) => {
        expect(response.body.token_type).toBe("Bearer");
        expect(response.body.expires_in).toBe(3600);
        expect(response.body.access_token).toBeTruthy();
        expect(response.body.access_token.split(".").length).toBe(3);
      });
  });

  it("allows client credentials in body", () => {
    return request(app.getHttpServer())
      .post("/oauth2/access_token")
      .send({
        grant_type: "client_credentials",
        client_id: client.id,
        client_secret: client.secret,
        scopes: ["scope-1"],
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .expect((response) => {
        expect(response.body.token_type).toBe("Bearer");
        expect(response.body.expires_in).toBe(3600);
        expect(response.body.access_token).toBeTruthy();
        expect(response.body.access_token.split(".").length).toBe(3);
      });
  });

  it("throws for client without client_credentials", () => {
    return request(app.getHttpServer())
      .post("/oauth2/access_token")
      .send({
        grant_type: "client_credentials",
        client_id: clientNoClientCredentialsAllowed.id,
        client_secret: clientNoClientCredentialsAllowed.secret,
        scopes: ["scope-1"],
      })
      .expect(403)
      .expect("Content-Type", /json/)
      .expect(({ body }) => {
        expect(body.message).toBe("oauth exception: error validating client");
      });
  });
});
