import { Body, Controller, Get, Post, Query, Redirect, Render, Req } from "@nestjs/common";
import type { Request } from "express";
import { IsEmail, IsUUID, MinLength } from "class-validator";

import { ForgotPasswordService } from "~/app/account/services/forgot_password.service";

class ResetPasswordGetParams {
  @IsEmail()
  e: string;

  @IsUUID()
  u: string;
}

class ResetPasswordPostParams extends ResetPasswordGetParams {
  @MinLength(5)
  password: string;
}

@Controller("/auth/reset_password")
export class ResetPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Get()
  @Render("auth/reset_password")
  async get(@Query() { e, u }: ResetPasswordGetParams, @Req() req: Request) {
    await this.forgotPasswordService.validateForgotPasswordToken(u, e);
    return {
      e,
      u,
      csrfToken: req.csrfToken(),
      resetPasswordFormAction: "/auth/reset_password",
    };
  }

  @Post()
  @Redirect("/")
  async post(@Body() { e, u, password }: ResetPasswordPostParams) {
    const success = await this.forgotPasswordService.updatePasswordFromToken(e, u, password);
    return { success };
  }
}
