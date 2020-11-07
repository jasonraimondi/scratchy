import { base64encode, REGEX_ACCESS_TOKEN } from "@jmondi/oauth2-server";
import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import request from "supertest";

import { AuthCode } from "../../src/app/oauth/entities/auth_code.entity";
import { Client } from "../../src/app/oauth/entities/client.entity";
import { Scope } from "../../src/app/oauth/entities/scope.entity";
import { Token } from "../../src/app/oauth/entities/token.entity";
import { OAuthModule } from "../../src/app/oauth/oauth.module";
import { ClientRepo } from "../../src/app/oauth/repositories/client.repository";
import { ScopeRepo } from "../../src/app/oauth/repositories/scope.repository";
import { attachMiddlewares } from "../../src/lib/middlewares/attach_middlewares";
import { createTestingModule } from "../app_testing.module";

describe("oauth2 client_credentials e2e", () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  let clientRepo: ClientRepo;
  let scopeRepo: ScopeRepo;

  let client: Client;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [OAuthModule],
      },
      [Token, AuthCode, Client, Scope],
    );

    clientRepo = moduleRef.get(ClientRepo);
    scopeRepo = moduleRef.get(ScopeRepo);

    const scope1 = await scopeRepo.create(new Scope({ name: "scope-1" }));
    const scope2 = await scopeRepo.create(new Scope({ name: "scope-2" }));

    client = await clientRepo.create(
      new Client({
        name: "test client",
        secret: "f6ce22eb-5bf7-4de6-9017-a5383facbb49",
        redirectUris: ["http://localhost"],
        allowedGrants: ["client_credentials"],
        scopes: [scope1, scope2],
      }),
    );

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
      .post("/oauth2/token")
      .set("Authorization", basicAuth)
      .send({
        grant_type: "client_credentials",
        scope: "scope-1 scope-2",
      })
      .expect((response) => {
        expect(response.status).toBe(200);
        expect(response.header["content-type"]).toMatch(/json/);
        expect(response.body.token_type).toBe("Bearer");
        expect(response.body.expires_in).toBe(3600);
        expect(response.body.access_token).toMatch(REGEX_ACCESS_TOKEN);
        expect(response.body.access_token.split(".").length).toBe(3);
        expect(response.body.refresh_token).toBeUndefined();
        expect(response.body.scope).toBe("scope-1 scope-2");
      });
  });

  it("allows client credentials in body", () => {
    return request(app.getHttpServer())
      .post("/oauth2/token")
      .send({
        grant_type: "client_credentials",
        client_id: client.id,
        client_secret: client.secret,
        scope: ["scope-1"],
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((response) => {
        expect(response.body.token_type).toBe("Bearer");
        expect(response.body.expires_in).toBe(3600);
        expect(response.body.access_token).toBeTruthy();
        expect(response.body.refresh_token).toBeUndefined();
        expect(response.body.access_token.split(".").length).toBe(3);
        expect(response.body.scope).toBe("scope-1");
      });
  });

  it("throws for client without client_credentials", async () => {
    const clientNoClientCredentialsAllowed = await clientRepo.create(
      new Client({
        name: "disallow-client-credentials",
        secret: "f6ce22eb-5bf7-4de6-9017-a5383facbb49",
        redirectUris: ["http://localhost"],
        allowedGrants: [],
      }),
    );

    return request(app.getHttpServer())
      .post("/oauth2/token")
      .send({
        grant_type: "client_credentials",
        client_id: clientNoClientCredentialsAllowed.id,
        client_secret: clientNoClientCredentialsAllowed.secret,
        scopes: ["scope-1"],
      })
      .expect(401)
      .expect("Content-Type", /json/)
      .expect((response) => {
        expect(response.body.message).toBe("Client authentication failed");
      });
  });
});
