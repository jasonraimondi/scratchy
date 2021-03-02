import { Controller, Get, Res } from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { ENV } from "~/config/environments";

@Controller()
export class AppController {
  @Get()
  async index(@Res() res: FastifyReply) {
    return res.status(302).redirect(`${ENV.apiUrl.toString()}/graphql`);
  }
}
