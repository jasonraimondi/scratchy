import { DateInterval } from "@jmondi/oauth2-server";
import { Controller, Get, Post, Render, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import querystring from "querystring";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";

@Controller("oauth2/scopes")
export class ScopesController {
  constructor(
    private readonly oauth: AuthorizationServer,
    private readonly clientRepo: ClientRepo,
    private readonly scopeRepo: ScopeRepo,
    private readonly userRepository: OAuthUserRepo,
  ) {}

  @Get()
  @Render("oauth/scopes")
  async get(@Req() req: Request) {
    await this.oauth.validateAuthorizationRequest(req);

    const query = req.query as any;

    const scope = query.scope;
    const client = await this.clientRepo.getByIdentifier(query.client_id);
    const user = await this.userRepository.findById(query.user_id);

    let scopeNames: string[] = [];
    if (typeof scope === "string" && scope !== "") {
      scopeNames = scope.split(" ");
    } else if (Array.isArray(scope)) {
      scopeNames = scope;
    }

    const scopes = await this.scopeRepo.getAllByIdentifiers(scopeNames);

    return {
      csrfToken: req.csrfToken(),
      submitUrl: "/oauth2/scopes?" + querystring.stringify(query),
      user,
      scopes,
      client,
    };
  }

  @Post()
  async post(@Req() req: Request, @Res() res: Response) {
    await this.oauth.validateAuthorizationRequest(req);

    const { accept } = req.body;

    const query = req.query as any;

    if (accept === "yes") {
      res.cookie("isAuthenticated", true, this.oauth.cookieOptions(new DateInterval("1m")));
      res.redirect("/oauth2/authorize?" + querystring.stringify(query));
      return;
    }

    const qs = querystring.stringify({
      error: querystring.escape("user declined scopes"),
    });

    res.redirect(query.redirect_uri + "?" + qs);
  }
}
