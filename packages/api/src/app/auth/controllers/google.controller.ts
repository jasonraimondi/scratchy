import { Controller, Get, Ip, Req, Res } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { AbstractProviderController } from "~/app/auth/controllers/_abstract.controller";

@Controller("oauth2/google")
export class GoogleController extends AbstractProviderController {
  @Get("callback")
  async googleAuthRedirect(@Req() req: FastifyRequest, @Res() res: FastifyReply, @Ip() ipAddr: string) {
    const result = await this.fastify.Google.getAccessTokenFromAuthorizationCodeFlow(req);
    const googleUser = await this.fetchGoogleUser(result.access_token);
    // @todo this google user needs a typed response
    const user = await this.userRepository.findByEmail(googleUser.email);
    const token = await this.authService.login({ user, res, ipAddr, rememberMe: false });
    return res.send(token);
  }

  private async fetchGoogleUser(accessToken: string) {
    const response = await this.httpService.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }).toPromise();
    if (!response?.data) throw new Error("user not found");
    return response.data;
  }
}
