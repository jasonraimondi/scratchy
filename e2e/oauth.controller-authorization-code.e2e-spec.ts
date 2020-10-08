import { IAuthCodePayload, REGEX_ACCESS_TOKEN } from "@jmondi/oauth2-server";
import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import crypto from "crypto";
import jwtDecode from "jwt-decode";
import querystring from "querystring";
import request from "supertest";

import { Token } from "../src/app/oauth/entities/token.entity";
import { AuthCode } from "../src/app/oauth/entities/auth_code.entity";
import { Client } from "../src/app/oauth/entities/client.entity";
import { Scope } from "../src/app/oauth/entities/scope.entity";
import { OAuthModule } from "../src/app/oauth/oauth.module";
import { ClientRepo } from "../src/app/oauth/repositories/client.repository";
import { ScopeRepo } from "../src/app/oauth/repositories/scope.repository";
import { attachMiddlewares } from "../src/lib/middlewares/attach_middlewares";
import { base64urlencode } from "../src/lib/utils/base64";
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
      [Token, AuthCode, Client, Scope],
    );

    const clientRepo = moduleRef.get(ClientRepo);
    const scopeRepo = moduleRef.get(ScopeRepo);

    client = await clientRepo.create(
      new Client({
        id: "becd6a60-7b2f-4454-9f77-ab31c05ca8d6",
        name: "test client",
        secret: undefined,
        redirectUris: ["http://localhost"],
        allowedGrants: ["authorization_code"],
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

  it.skip("allows auth code grant with PKCE S256", async () => {
    const http = app.getHttpServer();

    const codeVerifier = crypto.randomBytes(40).toString("hex");
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

    const authorizeResponseQuery: any = querystring.parse(authorizeResponse.headers.location);
    const decodedCode: IAuthCodePayload = jwtDecode(authorizeResponseQuery.code);

    expect(authorizeResponse.status).toBe(302);
    expect(authorizeResponse.headers.location).toMatch(new RegExp("http://localhost"));
    expect(decodedCode.client_id).toBe(client.id);
    expect(decodedCode.expire_time).toBeGreaterThan(Date.now() / 1000);
    expect(authorizeResponseQuery.state).toBe("state-is-a-secret");

    const tokenResponse = await request(http)
      .post("/oauth2/token")
      .send({
        grant_type: "authorization_code",
        code: authorizeResponseQuery.code,
        redirect_uri: "http://localhost",
        client_id: client.id,
        code_verifier: codeVerifier,
      });

    expect(tokenResponse.status).toBe(200);
    expect(tokenResponse.body.token_type).toBe("Bearer");
    expect(tokenResponse.body.access_token).toMatch(REGEX_ACCESS_TOKEN);
  });
});

