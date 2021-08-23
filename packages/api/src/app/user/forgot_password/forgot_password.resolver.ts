import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";

import { ForgotPasswordService } from "~/app/user/forgot_password/forgot_password.service";
import { AuthService } from "~/app/auth/services/auth.service";
import { LoginResponse } from "~/app/auth/dto/auth.response";
import {
  SendForgotPasswordInput,
  UpdatePasswordFromTokenInput,
  ValidateForgotPasswordTokenInput,
} from "~/app/user/forgot_password/forgot_password.input";
import { MyContext } from "~/config/context";

@Injectable()
@Resolver()
export class ForgotPasswordResolver {
  constructor(
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => Boolean!)
  async validateForgotPasswordToken(@Args("input") data: ValidateForgotPasswordTokenInput) {
    return this.forgotPasswordService.validateForgotPasswordToken(data);
  }

  @Mutation(() => Boolean!)
  sendForgotPasswordEmail(@Args("input") data: SendForgotPasswordInput) {
    return this.forgotPasswordService.sendForgotPasswordEmail(data.email);
  }

  @Mutation(() => LoginResponse!)
  async updatePasswordFromToken(
    @Args("input") data: UpdatePasswordFromTokenInput,
    @Context() { res, ipAddr }: MyContext,
  ): Promise<LoginResponse> {
    const user = await this.forgotPasswordService.updatePasswordFromToken(data);
    return this.authService.login({ res, ipAddr, user });
  }
}
