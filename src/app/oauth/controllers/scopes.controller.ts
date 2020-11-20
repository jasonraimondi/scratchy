import { Controller, Get, Post, Render, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import querystring from "querystring";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { API_ROUTES } from "~/config/routes";
import { MyJwtService } from "~/app/jwt/jwt.service";
import { COOKIES } from "~/config/cookies";

export interface AuthorizationCookie {
  isAuthorizationApproved: boolean;
}

@Controller("oauth2/scopes")
export class ScopesController {
  constructor(
    private readonly oauth: AuthorizationServer,
    private readonly clientRepo: ClientRepo,
    private readonly scopeRepo: ScopeRepo,
    private readonly userRepository: OAuthUserRepo,
    private readonly jwt: MyJwtService,
  ) {}

  @Get()
  @Render("auth/scopes")
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
      submitUrl: API_ROUTES.scopes.template + "?" + querystring.stringify(query),
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

    if (accept !== "yes") {
      res.redirect(query.redirect_uri + "?error=user declined scopes");
      return;
    }

    const authorizationCookie: AuthorizationCookie = { isAuthorizationApproved: true };
    const fooby = await this.jwt.sign(authorizationCookie);
    res.cookie(COOKIES.authorization, fooby, this.oauth.cookieOptions());
    res.redirect(API_ROUTES.authorize.template + "?" + querystring.stringify(query));
  }
}
