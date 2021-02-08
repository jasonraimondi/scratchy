import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";

@Controller()
export class AppController {
  @Get()
  async index(@Res() res: Response) {
    return res.redirect("http://localhost:3000");
  }
}
