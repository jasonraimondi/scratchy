import { TestingModule } from "@nestjs/testing";
import crypto from "crypto";
import * as querystring from "querystring";

import { ScopesController } from "~/app/oauth/controllers/scopes.controller";
import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { Token } from "~/app/oauth/entities/token.entity";
import { OAuthModule } from "~/app/oauth/oauth.module";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { base64urlencode } from "~/lib/utils/base64";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";
import { mockRequest, mockResponse } from "~test/mock_application";
import { COOKIES } from "~/config/cookies";

describe("ScopesController", () => {
  let controller: ScopesController;
  let client: Client;
  let user: User;
  let query: Record<string, string>;

  const codeVerifier = crypto.randomBytes(40).toString("hex");
  const codeChallenge = base64urlencode(crypto.createHash("sha256").update(codeVerifier).digest("hex"));

  beforeAll(async () => {
    const module: TestingModule = await createTestingModule(
      {
        imports: [OAuthModule],
      },
      [Token, AuthCode, Client, Scope],
    );

    controller = module.get<ScopesController>(ScopesController);
    const clientRepo = module.get(ClientRepo);
    const userRepo = module.get(UserRepo);
    client = await clientRepo.create(
      new Client({
        id: "becd6a60-7b2f-4454-9f77-ab31c05ca8d6",
        name: "test client",
        secret: undefined,
        redirectUris: ["http://example.com"],
        allowedGrants: ["authorization_code"],
      }),
    );

    query = {
      response_type: "code",
      client_id: client.id,
      redirect_uri: "http://example.com",
      state: "state-is-a-secret",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    };

    user = await userGenerator();
    await userRepo.save(user);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("get succeeds", async () => {
    // arrange
    const request = mockRequest({ query });

    // act
    const response = await controller.get(request);
    const [path, responseQuery] = response.submitUrl.split("?");
    const parsedResponseQuery = querystring.parse(responseQuery);

    // assert
    expect(response.csrfToken).toBe("sample-csrf-token");
    expect(path).toBe("http://localhost/oauth2/scopes");
    expect(parsedResponseQuery).toEqual(query);
  });

  it("post succeeds", async () => {
    // arrange
    const body = { accept: "yes" };
    const request = mockRequest({ query, body, cookies: { isAuthorized: true } });
    const response = mockResponse();

    // act
    await controller.post(request, response);

    // assert
    const [path, responseQuery] = response.redirect.split("?");
    const parsedResponseQuery = querystring.parse(responseQuery);
    expect(path).toBe("http://localhost/oauth2/authorize");
    expect(parsedResponseQuery).toEqual(query);
    expect(response.cookies[COOKIES.authorization]).toBeTruthy();
  });
});
