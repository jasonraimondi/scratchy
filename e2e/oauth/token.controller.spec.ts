import { TestingModule } from "@nestjs/testing";
import { AuthCode } from "../../src/app/oauth/entities/auth_code.entity";
import { Client } from "../../src/app/oauth/entities/client.entity";
import { Scope } from "../../src/app/oauth/entities/scope.entity";
import { Token } from "../../src/app/oauth/entities/token.entity";
import { OAuthModule } from "../../src/app/oauth/oauth.module";
import { createTestingModule } from "../../test/app_testing.module";
import { TokenController } from "../../src/app/oauth/controllers/token.controller";

describe("TokenController", () => {
  let controller: TokenController;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule(
      {
        imports: [OAuthModule],
      },
      [Token, AuthCode, Client, Scope],
    );

    controller = module.get<TokenController>(TokenController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
