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
      [AccessToken, RefreshToken, AuthorizationCode, Client, Scope],
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
      .post("/oauth2/authorize")
      .query({
        response_type: "client_credentials",
        client_id: client.id,
        redirect_uri: client.redirectUris[0],
        scope: "scope-1 scope-2",
        state: "abcdefghijklmnopqrstuvwxyz123456789",
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
});
