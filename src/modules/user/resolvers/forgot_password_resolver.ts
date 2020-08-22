import { Arg, Mutation, Resolver } from "type-graphql";
import { Inject } from "@nestjs/common";

import { User } from "~/entity/user/user_entity";

import { REPOSITORY, SERVICE } from "~/lib/constants/inversify";
import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import {
  SendForgotPasswordInput,
  UpdatePasswordInput,
} from "~/modules/user/dtos/forgot_password_input";
import { IUserRepository } from "~/lib/repository/user/user.repository";
import { ForgotPasswordEmail } from "~/modules/user/emails/forgot_password.email";
import { IForgotPasswordRepository } from "~/lib/repository/user/forgot_password.repository";

@Resolver()
export class ForgotPasswordResolver {
  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    @Inject(REPOSITORY.ForgotPasswordRepository)
    private forgotPasswordRepository: IForgotPasswordRepository,
    private forgotPasswordEmail: ForgotPasswordEmail,
  ) {}

  @Mutation(() => Boolean!)
  async validateForgotPasswordToken(
    @Arg("token") token: string,
    @Arg("email") email: string,
  ) {
    const forgotPassword = await this.forgotPasswordRepository.findById(token);
    if (forgotPassword.user.email !== email.toLowerCase()) {
      throw new Error("invalid email or token");
    }
    return true;
  }

  @Mutation(() => Boolean)
  async sendForgotPasswordEmail(
    @Arg("data") { email }: SendForgotPasswordInput,
  ) {
    const user = await this.userRepository.findByEmail(email);
    const forgotPassword = await this.getForgotPasswordForUser(user);
    try {
      await this.forgotPasswordRepository.save(forgotPassword);
      await this.forgotPasswordEmail.send(forgotPassword);
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  @Mutation(() => Boolean)
  async updatePasswordFromToken(
    @Arg("data") { token, email, password }: UpdatePasswordInput,
  ) {
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
