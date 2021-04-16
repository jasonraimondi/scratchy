import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";

import { ForgotPasswordService } from "~/app/user/services/forgot_password.service";
import {
  SendForgotPasswordInput,
  UpdatePasswordFromTokenInput,
  ValidateForgotPasswordTokenInput,
} from "~/app/user/resolvers/account/inputs/forgot_password_input";
import { LoginResponse } from "~/app/user/resolvers/account/responses/login_response";
import { MyContext } from "~/lib/graphql/my_context";
import { AuthService } from "~/app/auth/services/auth.service";

@Injectable()
@Resolver()
export class ForgotPasswordResolver {
  constructor(
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => Boolean!)
  async validateForgotPasswordToken(@Args("data") data: ValidateForgotPasswordTokenInput) {
    return this.forgotPasswordService.validateForgotPasswordToken(data);
  }

  @Mutation(() => Boolean)
  sendForgotPasswordEmail(@Args("data") { email }: SendForgotPasswordInput) {
    return this.forgotPasswordService.sendForgotPasswordEmail(email);
  }

  @Mutation(() => LoginResponse)
  async updatePasswordFromToken(
    @Args("data") data: UpdatePasswordFromTokenInput,
    @Context() { res, ipAddr }: MyContext,
  ): Promise<LoginResponse> {
    const user = await this.forgotPasswordService.updatePasswordFromToken(data);
    return this.authService.login({ res, ipAddr, user });
  }
}
