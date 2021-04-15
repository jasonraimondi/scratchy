import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { RegisterInput } from "~/app/user/resolvers/account/inputs/register.input";
import { createEmailConfirmation } from "~/entities/email_confirmation.entity";
import { User } from "~/entities/user.entity";
import { RegisterEmail } from "~/lib/email/emails/register.email";
import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { MyContext } from "~/lib/graphql/my_context";
import { LoggerService } from "~/lib/logger/logger.service";

@Resolver()
export class RegisterResolver {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly registerEmail: RegisterEmail,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Mutation(() => User)
  async register(@Args("data") data: RegisterInput, @Context() { ipAddr }: MyContext): Promise<User> {
    return await this.registerUser(data, ipAddr);
  }

  @Mutation(() => Boolean!)
  async resendConfirmEmail(@Args("email") email: string): Promise<boolean> {
    const emailConfirmation = await this.emailConfirmationRepository.findByEmail(email);

    try {
      await this.registerEmail.send(emailConfirmation);
      return true;
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }

  private async registerUser(registerInput: RegisterInput, ipAddr: string) {
    await this.guardAgainstDuplicateUser(registerInput.email, registerInput.id);

    const user = await User.create({
      ...registerInput,
      createdIP: ipAddr,
    });

    if (registerInput.password) await user.setPassword(registerInput.password);

    const emailConfirmation = await createEmailConfirmation({ user });

    await this.userRepository.create(user);

    await this.emailConfirmationRepository.create(emailConfirmation);

    await this.registerEmail.send(emailConfirmation);

    return user;
  }

  private async guardAgainstDuplicateUser(email: string, id?: string) {
    const falsy = () => false;
    if (id && (await this.userRepository.findById(id).catch(falsy))) {
      throw new Error("duplicate id for user");
    }
    if (await this.userRepository.findByEmail(email).catch(falsy)) {
      throw new Error("duplicate emails for user");
    }
  }
}
