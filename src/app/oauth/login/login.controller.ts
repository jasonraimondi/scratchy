import { Controller, Get, Render, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";

@Controller("login")
export class LoginController {
  @Get("/")
  @Render("oauth/login")
  async login(@Req() req: Request, @Res() res: Response) {
    const query = req.query;
    console.log(query);
    return { message: "Hello flowr!" };
  }
}
