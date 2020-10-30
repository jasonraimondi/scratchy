import { TestingModule } from "@nestjs/testing";
import { GithubController } from "~/app/oauth/controllers/providers/github.controller";
import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { Token } from "~/app/oauth/entities/token.entity";
import { OAuthModule } from "~/app/oauth/oauth.module";
import { createTestingModule } from "~test/app_testing.module";

describe("GithubController", () => {
  let controller: GithubController;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule(
      {
        imports: [OAuthModule],
      },
      [Token, AuthCode, Client, Scope],
    );

    controller = module.get<GithubController>(GithubController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
