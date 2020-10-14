import { DateInterval } from "@jmondi/oauth2-server";
import { Controller, Get, HttpStatus, Ip, Post, Render, Req, Res } from "@nestjs/common";
import { IsEmail } from "class-validator";
import type { Request, Response } from "express";
import querystring from "querystring";

import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { MyJwtService } from "~/app/oauth/services/jwt.service";

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
    private readonly jwt: MyJwtService,
  ) {}

  @Get()
  @Render("oauth/login")
  async get(@Req() req: Request) {
    await this.oauth.validateAuthorizationRequest(req);

    const query = req.query as any;

    return {
      csrfToken: req.csrfToken(),
      loginFormAction: "/oauth2/login?" + querystring.stringify(query),
    };
  }

  @Post()
  async post(@Req() req: Request, @Res() res: Response, @Ip() ipAddr: string) {
    await this.oauth.validateAuthorizationRequest(req);

    const { email, password } = req.body;

    const query = req.query as any;

    const user = await this.userRepository.findByEmail(email);

    await user.verify(password);

    await this.userRepository.incrementLastLogin(user, ipAddr);

    const jwt = await this.jwt.sign({
      userId: user.id,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
    });

    // @todo extract cookie ttl to config
    const options = this.oauth.cookieOptions(new DateInterval("1m"));

    res.cookie("jwt", jwt, options);
    res.status(HttpStatus.FOUND);
    res.redirect("/oauth2/authorize?" + querystring.stringify(query));
  }
}
