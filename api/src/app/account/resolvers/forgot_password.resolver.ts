import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";

import { ForgotPasswordService } from "~/app/account/services/forgot_password.service";
import { SendForgotPasswordInput, UpdatePasswordInput } from "~/app/account/resolvers/auth/forgot_password_input";

@Injectable()
@Resolver()
export class ForgotPasswordResolver {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Mutation(() => Boolean!)
  validateForgotPasswordToken(@Args("token") token: string, @Args("email") email: string) {
    return this.forgotPasswordService.validateForgotPasswordToken(token, email);
  }

  @Mutation(() => Boolean)
  sendForgotPasswordEmail(@Args("data") { email }: SendForgotPasswordInput) {
    return this.forgotPasswordService.sendForgotPasswordEmail(email);
  }

  @Mutation(() => Boolean)
  async updatePasswordFromToken(@Args("data") { token, email, password }: UpdatePasswordInput) {
    return this.forgotPasswordService.updatePasswordFromToken(email, token, password);
  }
}
