import { Controller, Get, Res } from "@nestjs/common";
import type { FastifyReply } from "fastify";

@Controller()
export class AppController {
  @Get()
  async index(@Res() res: FastifyReply) {
    return res.status(302).redirect("http://localhost:3001/graphql");
  }
}
