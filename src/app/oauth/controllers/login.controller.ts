import { DateInterval } from "@jmondi/oauth2-server";
import { Controller, Get, HttpException, HttpStatus, Post, Render, Req, Res } from "@nestjs/common";
import { IsEmail } from "class-validator";
import { query } from "express";
import type { Request, Response } from "express";
import querystring from "querystring";

import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { MyJwtService } from "~/app/oauth/services/jwt.service";
import { User } from "~/entity/user/user.entity";

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
  async post(@Req() req: Request, @Res() res: Response) {
    await this.oauth.validateAuthorizationRequest(req);

    const { email, password } = req.body;

    const query = req.query as any;

    const user = await this.userRepository.findOneBy({ email });

    await user.verify(password);

    if (!user) {
      throw new HttpException("user not found fix this error", 400);
    }

    const payload = {
      userId: user.id,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
    };

    const jwt = await this.jwt.sign(payload);

    res.cookie("jwt", jwt, this.oauth.cookieOptions(new DateInterval("1m"))); // @todo extract cookie ttl to config
    res.status(HttpStatus.FOUND);
    res.redirect("/oauth2/authorize?" + querystring.stringify(query));
    return res;
  }
}
