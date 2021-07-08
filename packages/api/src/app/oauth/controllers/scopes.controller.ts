import { Body, Controller, Get, Post, Query, Render, Req, Res } from "@nestjs/common";
import querystring from "querystring";
import { OAuthRequest } from "@jmondi/oauth2-server";
import type { FastifyReply, FastifyRequest } from "fastify";
import { IsString, IsUrl } from "class-validator";

import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { ClientRepository } from "~/app/oauth/repositories/client.repository";
import { API_ROUTES } from "~/config/routes";
import { COOKIES } from "~/config/cookies";
import { MyJwtService } from "~/lib/jwt/jwt.service";
import { ScopeRepository } from "~/app/oauth/repositories/scope.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";

export interface AuthorizationCookie {
  isAuthorizationApproved: boolean;
}

class PostScopesBody {
  @IsString()
  accept!: string;
}

class PostScopesQuery {
  @IsUrl()
  redirect_uri!: string;
}

@Controller("oauth2/scopes")
export class ScopesController {
  constructor(
    private readonly oauth: AuthorizationServer,
    private readonly clientRepo: ClientRepository,
    private readonly scopeRepo: ScopeRepository,
    private readonly userRepository: UserRepository,
    private readonly jwt: MyJwtService,
  ) {}

  @Get()
  @Render("auth/scopes")
  async get(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const request = OAuthRequest.fromFastify(req);

    await this.oauth.validateAuthorizationRequest(request);

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
      csrfToken: await res.generateCsrf(),
      submitUrl: API_ROUTES.scopes.template + "?" + querystring.stringify(query),
      user,
      scopes,
      client,
    };
  }

  @Post()
  async post(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Body() body: PostScopesBody,
    @Query() query: PostScopesQuery,
  ) {
    const request = OAuthRequest.fromFastify(req);
    await this.oauth.validateAuthorizationRequest(request);

    const { accept } = body;

    if (accept) {
      res.redirect(query.redirect_uri + "?error=user declined scopes");
      return;
    }

    const authorizationCookie: AuthorizationCookie = { isAuthorizationApproved: true };
    const signedCookie = await this.jwt.sign(authorizationCookie);

    res.cookie(COOKIES.authorization, signedCookie, this.oauth.cookieOptions());
    res.redirect(API_ROUTES.authorize.template + "?" + querystring.stringify({ ...query }));
  }
}
