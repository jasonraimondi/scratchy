import { TestingModule } from "@nestjs/testing";

import { GoogleController } from "~/app/oauth/controllers/providers/google.controller";
import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { Token } from "~/app/oauth/entities/token.entity";
import { OAuthModule } from "~/app/oauth/oauth.module";
import { createTestingModule } from "~test/app_testing.module";

describe("GoogleController", () => {
  let controller: GoogleController;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule(
      {
        imports: [OAuthModule],
      },
      [Token, AuthCode, Client, Scope],
    );

    controller = module.get<GoogleController>(GoogleController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
