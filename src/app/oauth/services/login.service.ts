import { DateInterval } from "@jmondi/oauth2-server";
import { HttpStatus, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import querystring from "querystring";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { MyJwtService } from "~/app/oauth/services/jwt.service";
import { User } from "~/entity/user/user.entity";

@Injectable()
export class LoginService {
  constructor(
    private readonly clientRepo: ClientRepo,
    private readonly scopeRepo: ScopeRepo,
    private readonly userRepository: OAuthUserRepo,
    private readonly oauth: AuthorizationServer,
    private readonly jwt: MyJwtService,
  ) {}

  async loginAndRedirect(user: User, ipAddr: string, res: Response, query: string) {
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
    res.redirect("/oauth2/authorize?" + query);
  }
}