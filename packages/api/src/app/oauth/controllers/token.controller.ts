import { handleFastifyError, OAuthRequest, OAuthResponse } from "@jmondi/oauth2-server";
import { Controller, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";

@Controller("oauth2/token")
export class TokenController {
  constructor(private readonly oauth: AuthorizationServer) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async post(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const request = OAuthRequest.fromFastify(req);
    const response = OAuthResponse.fromFastify(res);

    try {
      const tokenResponse = await this.oauth.respondToAccessTokenRequest(request, response);
      res.headers(tokenResponse.headers);
      res.status(tokenResponse.status).send(tokenResponse.body);
      return;
    } catch (e) {
      handleFastifyError(e, res);
      return;
    }
  }
}
