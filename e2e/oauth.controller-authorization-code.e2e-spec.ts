import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import crypto from "crypto";
import jwtDecode from "jwt-decode";
import * as querystring from "querystring";
import request from "supertest";

import { AccessToken } from "../src/app/oauth/entities/access_token.entity";
import { AuthCode } from "../src/app/oauth/entities/auth_code.entity";
import { Client } from "../src/app/oauth/entities/client.entity";
import { RefreshToken } from "../src/app/oauth/entities/refresh_token.entity";
import { Scope } from "../src/app/oauth/entities/scope.entity";
import { IAuthCodePayload } from "../src/app/oauth/grants/auth_code.grant";
import { OAuthModule } from "../src/app/oauth/oauth.module";
import { ClientRepo } from "../src/app/oauth/repositories/client.repository";
import { ScopeRepo } from "../src/app/oauth/repositories/scope.repository";
import { attachMiddlewares } from "../src/lib/middlewares/attach_middlewares";
import { base64encode, base64urlencode } from "../src/lib/utils/base64";
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

  it("allows auth code grant with PKCE S256", async () => {
    const http = app.getHttpServer();

    const codeVerifier = base64urlencode(crypto.randomBytes(40));
    const codeChallenge = base64urlencode(crypto.createHash("sha256").update(codeVerifier).digest("hex"));

    const authorizeResponse = await request(http)
      .get("/oauth2/authorize")
      .query({
        response_type: "code",
        client_id: client.id,
        redirect_uri: "http://localhost",
        scope: "scope-1 scope-2",
        state: "state-is-a-secret",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });

    const authorizeResponseQuery = querystring.parse(authorizeResponse.headers.location);
    const decodedCode: IAuthCodePayload = jwtDecode(authorizeResponseQuery.code!.toString());

    expect(authorizeResponse.status).toBe(302);
    expect(authorizeResponse.headers.location).toMatch(new RegExp("http://localhost"));
    expect(decodedCode.client_id).toBe(client.id);
    expect(decodedCode.expire_time).toBeGreaterThan(Date.now() / 1000);
    expect(authorizeResponseQuery.state).toBe("state-is-a-secret");

    const tokenResponse = await request(http)
      .post("/oauth2/access_token")
      .send({
        grant_type: "authorization_code",
        code: authorizeResponseQuery.code,
        redirect_uri: "http://localhost",
        client_id: client.id,
        code_verifier: codeVerifier,
      });

    console.log(tokenResponse.body);
    expect(tokenResponse.status).toBe(201);
    expect(tokenResponse.body.token_type).toBe("Bearer");
    expect(tokenResponse.body.access_token.length).toBe(80);
    expect(tokenResponse.body.refresh_token.length).toBe(80);
  });
});
