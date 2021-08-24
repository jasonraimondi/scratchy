import { Controller, Get, Ip, Req, Res } from "@nestjs/common";
import { base64urlencode } from "@jmondi/oauth2-server";
import { HttpService } from "@nestjs/axios";
import { FastifyReply, FastifyRequest } from "fastify";

import { WEB_ROUTES } from "~/config";
import { FastifyOAuthClientService } from "~/app/auth/services/fastify_oauth.service";

@Controller("oauth2/facebook")
export class FacebookController {
  constructor(private readonly httpService: HttpService, private readonly oauthService: FastifyOAuthClientService) {}

  @Get("callback")
  async facebook(@Req() req: FastifyRequest, @Res() res: FastifyReply, @Ip() ipAddr: string) {
    const { access_token } = await this.oauthService.facebook.getAccessTokenFromAuthorizationCodeFlow(req);
    const facebookUser = await this.httpService
      .get(`https://graph.facebook.com/me?access_token=${access_token}`)
      .toPromise();
    console.log({ facebookUser });
    const token: any = { ipAddr };
    // const token = await this.authService.login({ user, res, ipAddr, rememberMe: false });
    const encodedToken = base64urlencode(JSON.stringify(token));
    return res.status(302).redirect(WEB_ROUTES.oauth_callback.create({ encodedToken }));
  }
}
