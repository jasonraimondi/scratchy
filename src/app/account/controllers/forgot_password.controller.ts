import { Body, Controller, Get, Post, Redirect, Render, Req } from "@nestjs/common";
import { IsEmail } from "class-validator";
import type { Request } from "express";

import { ForgotPasswordService } from "~/app/account/services/forgot_password.service";

class ForgotPasswordParams {
  @IsEmail()
  email: string;
}

@Controller("/auth/forgot_password")
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Get()
  @Render("auth/forgot_password")
  async get(@Req() req: Request) {
    return {
      csrfToken: req.csrfToken(),
      formAction: "/auth/forgot_password",
    };
  }

  @Post()
  @Redirect("/")
  async post(@Body() { email }: ForgotPasswordParams) {
    await this.forgotPasswordService.sendForgotPasswordEmail(email);
    return {};
  }
}
