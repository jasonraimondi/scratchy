import { DateInterval } from "@jmondi/oauth2-server";
import { Controller, Get, HttpStatus, Ip, Post, Render, Req, Res } from "@nestjs/common";
import { IsEmail } from "class-validator";
import type { Request, Response } from "express";
import querystring from "querystring";

import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { LoginService } from "~/app/oauth/services/login.service";

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
  @Render("oauth/login")
  async get(@Req() req: Request) {
    await this.oauth.validateAuthorizationRequest(req);

    return {
      csrfToken: req.csrfToken(),
      loginFormAction: "/oauth2/login?" + querystring.stringify(req.query as any),
    };
  }

  @Post()
  async post(@Req() req: Request, @Res() res: Response, @Ip() ipAddr: string) {
    await this.oauth.validateAuthorizationRequest(req);

    const { email, password } = req.body;

    const user = await this.userRepository.findByEmail(email);

    await user.verify(password);

    const query = querystring.stringify(req.query as any);

    await this.loginService.loginAndRedirect(user, ipAddr, res, query);
  }
}
