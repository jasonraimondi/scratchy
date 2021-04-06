import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";

import { ForgotPasswordService } from "~/app/account/services/forgot_password.service";
import {
  SendForgotPasswordInput,
  UpdatePasswordInput,
  ValidateForgotPasswordTokenInput,
} from "~/app/account/resolvers/auth/forgot_password_input";
import { LoginResponse } from "~/app/account/resolvers/auth/login_response";
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
    const response = await this.forgotPasswordService.validateForgotPasswordToken(data);
    console.log({ response });
    return response;
  }

  @Mutation(() => Boolean)
  sendForgotPasswordEmail(@Args("data") { email }: SendForgotPasswordInput) {
    return this.forgotPasswordService.sendForgotPasswordEmail(email);
  }

  @Mutation(() => LoginResponse)
  async updatePasswordFromToken(
    @Args("data") data: UpdatePasswordInput,
    @Context() { res }: MyContext,
  ): Promise<LoginResponse> {
    const user = await this.forgotPasswordService.updatePasswordFromToken(data);
    const accessToken = await this.authService.createAccessToken(user);
    await this.authService.sendRefreshToken(res, false, user);
    return { accessToken, user };
  }
}
