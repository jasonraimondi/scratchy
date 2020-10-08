import { Controller, Get, Res } from "@nestjs/common";

import type { Response } from "express";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { base64urlencode } from "~/lib/utils/base64";

@Controller("oauth2/help")
export class HelpController {
  constructor(
    private readonly clientRepo: ClientRepo,
    private readonly scopeRepo: ScopeRepo,
    private readonly userRepository: OAuthUserRepo,
    private readonly authServer: AuthorizationServer,
  ) {}

  @Get()
  async help(@Res() res: Response) {
    let client: Client;
    let scope1: Scope;
    let scope2: Scope;

    try {
      scope1 = await this.scopeRepo.findById(1);
    } catch (e) {
      scope1 = await this.scopeRepo.create(
        new Scope({
          id: 1,
          name: "contacts.read",
          description: "Can read your contacts",
        }),
      );
    }

    try {
      scope2 = await this.scopeRepo.findById(2);
    } catch (e) {
      scope2 = await this.scopeRepo.create(
        new Scope({
          id: 2,
          name: "contacts.write",
          description: "Can make changes to your contacts",
        }),
      );
    }

    try {
      client = await this.clientRepo.findById("39ce3891-7e0f-4f87-9bc0-db7cc2902266");
    } catch (e) {
      client = await this.clientRepo.create(
        new Client({
          id: "39ce3891-7e0f-4f87-9bc0-db7cc2902266",
          name: "Testing Client",
          redirectUris: ["http://localhost:3000/farty"],
          scopes: [scope1, scope2],
        }),
      );
    }

    const crypto = await import("crypto");
    const querystring = await import("querystring");

    const codeVerifier = crypto.randomBytes(40).toString("hex");
    const codeChallenge = base64urlencode(crypto.createHash("sha256").update(codeVerifier).digest("hex"));

    const query = {
      response_type: "code",
      client_id: client.id,
      redirect_uri: client.redirectUris[0],
      scope: `${scope1.name} ${scope2.name}`,
      state: "state-is-a-secret",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    };

    return res.redirect("/oauth2/authorize?" + querystring.stringify(query));
  }
}
