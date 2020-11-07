import { Body, Controller, Get, Post, Query, Redirect, Render, Req } from "@nestjs/common";
import type { Request } from "express";
import { EmailConfirmationService } from "~/app/account/services/email_confirmation.service";
import { EmailConfirmationInput } from "~/app/account/controllers/email_confirmation.input";

@Controller("/auth/email_confirmation")
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Get()
  @Render("auth/email_confirmation")
  async get(@Query() { e, u }: EmailConfirmationInput, @Req() req: Request) {
    return {
      e,
      u,
      csrfToken: req.csrfToken(),
      formAction: "/auth/email_confirmation",
    };
  }

  @Post()
  @Redirect("/")
  async post(@Body() { e, u }: EmailConfirmationInput) {
    const success = await this.emailConfirmationService.verifyEmailConfirmation(e, u);
    return { success };
  }
}
