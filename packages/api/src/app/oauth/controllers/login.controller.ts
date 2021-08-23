import { Body, Controller, Get, Post, Render, Req, Res } from "@nestjs/common";
import { OAuthRequest } from "@jmondi/oauth2-server";
import { IsEmail, Length } from "class-validator";
import type { FastifyRequest, FastifyReply } from "fastify";
import querystring from "querystring";

import { LoginService } from "~/app/oauth/services/login.service";
import { API_ROUTES } from "~/config/routes";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { UnauthorizedException } from "~/lib/exceptions/unauthorized.exception";

export class PostLoginBody {
  @IsEmail()
  email!: string;
  @Length(8)
  password!: string;
}

@Controller("oauth2/login")
export class LoginController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly oauth: AuthorizationServer,
    private readonly loginService: LoginService,
  ) {}

  @Get()
  @Render("auth/login")
  async get(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const request = OAuthRequest.fromFastify(req);
    await this.oauth.validateAuthorizationRequest(request);

    return {
      csrfToken: res.generateCsrf(),
      loginFormAction: API_ROUTES.login.template + "?" + querystring.stringify(req.query as any),
      forgotPasswordLink: "/auth/forgot_password",
    };
  }

  @Post()
  async post(@Req() req: FastifyRequest, @Res() res: FastifyReply, @Body() body: PostLoginBody) {
    const request = OAuthRequest.fromFastify(req);

    await this.oauth.validateAuthorizationRequest(request);

    try {
      const user = await this.userRepository.findByEmail(body.email);
      await user.verify(body.password);
      const query = querystring.stringify(<any>req.query ?? {});
      await this.loginService.loginAndRedirect(user, req.ip, res, query);
      return;
    } catch (e) {}

    throw new UnauthorizedException();
  }
}
