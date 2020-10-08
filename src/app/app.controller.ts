import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";

@Controller()
export class AppController {
  @Get()
  async index(@Res() res: Response) {
    res.redirect("/oauth2/help");
    return;
  }
}
