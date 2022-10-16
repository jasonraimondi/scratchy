import { Injectable } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { EmailConfirmationService } from "~/app/user/email_confirmation/email_confirmation.service";
import { VerifyEmailInput } from "~/app/user/email_confirmation/email_confirmation.input";
import { LoginResponse } from "~/app/auth/dto/auth.dtos";
import { AuthService } from "~/app/auth/services/auth.service";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { MyContext } from "~/config/graphql";

@Injectable()
@Resolver()
export class EmailConfirmationResolver {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => LoginResponse!)
  async verifyEmailConfirmation(
    @Args("input") { token, email }: VerifyEmailInput,
    @Context() { res, ipAddr }: MyContext,
  ): Promise<LoginResponse> {
    await this.emailConfirmationService.verifyEmailConfirmation(email, token);
    const user = await this.userRepository.findByEmail(email);
    return this.authService.login({ res, ipAddr, user });
  }
}
