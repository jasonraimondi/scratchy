import { Controller, Get, HttpStatus, Ip, Post, Render, Req, Res } from "@nestjs/common";
import { IsEmail } from "class-validator";
import type { Request, Response } from "express";
import querystring from "querystring";

import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { LoginService } from "~/app/oauth/services/login.service";
import { UnauthorizedException } from "~/app/user/exceptions/unauthorized.exception";
import { API_ROUTES } from "~/config/routes";
import { COOKIES } from "~/config/cookies";

export class LoginForm {
  @IsEmail()
  email: string;
  password: string;
}

@Controller("oauth2/login")
export class LoginController {
  constructor(
    private readonly clientRepo: ClientRepo,
    private readonly scopeRepo: ScopeRepo,
    private readonly userRepository: OAuthUserRepo,
    private readonly oauth: AuthorizationServer,
    private readonly loginService: LoginService,
  ) {}

  @Get()
  @Render("auth/login")
  async get(@Req() req: Request) {
    await this.oauth.validateAuthorizationRequest(req);

    return {
      csrfToken: req.csrfToken(),
      loginFormAction: API_ROUTES.login.template + "?" + querystring.stringify(req.query as any),
      forgotPasswordLink: "/auth/forgot_password",
    };
  }

  @Post()
  async post(@Req() req: Request, @Res() res: Response) {
    await this.oauth.validateAuthorizationRequest(req);

    const { email, password } = req.body;

    try {
      const user = await this.userRepository.findByEmail(email);
      await user.verify(password);
      const query = querystring.stringify(req.query as any);
      await this.loginService.loginAndRedirect(user, req.ip, res, query);
      return;
    } catch (e) {
    }

    throw UnauthorizedException.invalid();
  }
}
