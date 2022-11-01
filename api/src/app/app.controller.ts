import { Controller, Get, Res } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { ENV } from "~/config/environment";

@Controller()
export class AppController {
  @Get("/")
  home(@Res() res: FastifyReply) {
    return res.status(302).redirect(ENV.urlWeb);
  }

  @Get("/ping")
  ping() {
    return "pong";
  }
}
