import { Inject, Logger } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { SendForgotPasswordInput, UpdatePasswordInput } from "~/app/user/dtos/forgot_password.input";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/config/keys";
import { ForgotPasswordEmail } from "~/lib/emails/modules/auth/forgot_password.email";
import { IForgotPasswordRepository } from "~/lib/repositories/user/forgot_password.repository";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

@Resolver()
export class ForgotPasswordResolver {
  private readonly logger = new Logger(ForgotPasswordResolver.name);

  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    @Inject(REPOSITORY.ForgotPasswordRepository) private forgotPasswordRepository: IForgotPasswordRepository,
    private forgotPasswordEmail: ForgotPasswordEmail,
  ) {}

  @Mutation(() => Boolean!)
  async validateForgotPasswordToken(@Args("token") token: string, @Args("email") email: string) {
    const forgotPassword = await this.forgotPasswordRepository.findById(token);
    if (forgotPassword.user.email !== email.toLowerCase()) {
      throw new Error("invalid emails or token");
    }
    return true;
  }

  @Mutation(() => Boolean)
  async sendForgotPasswordEmail(@Args("data") { email }: SendForgotPasswordInput) {
    const user = await this.userRepository.findByEmail(email);
    const forgotPassword = await this.getForgotPasswordForUser(user);
    try {
      await this.forgotPasswordRepository.save(forgotPassword);
      await this.forgotPasswordEmail.send(forgotPassword);
      return true;
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }

  @Mutation(() => Boolean)
  async updatePasswordFromToken(@Args("data") { token, email, password }: UpdatePasswordInput) {
    const forgotPassword = await this.forgotPasswordRepository.findById(token);
    const { user } = forgotPassword;
    if (email !== user.email) {
      throw new Error("invalid access");
    }
    await user.setPassword(password);
    try {
      await this.userRepository.save(user);
      await this.forgotPasswordRepository.delete(forgotPassword.id);
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  private async getForgotPasswordForUser(user: User) {
    try {
      return await this.forgotPasswordRepository.findForUser(user.id);
    } catch (e) {}
    const forgotPassword = new ForgotPasswordToken();
    forgotPassword.user = user;
    await this.forgotPasswordRepository.save(forgotPassword);
    return forgotPassword;
  }
}
