import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { RegisterInput } from "~/app/account/resolvers/register.input";
import { EmailConfirmationToken } from "~/app/account/entities/email_confirmation.entity";
import { User } from "~/app/user/entities/user.entity";
import { RegisterEmail } from "~/app/emails/emails/register.email";
import { LoggerService } from "~/app/logger/logger.service";
import { EmailConfirmationRepo } from "~/app/user/repositories/repositories/email_confirmation.repository";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { MyContext } from "~/lib/graphql/my_context";

@Resolver()
export class RegisterResolver {
  constructor(
    private readonly userRepository: UserRepo,
    private readonly emailConfirmationRepository: EmailConfirmationRepo,
    private readonly registerEmail: RegisterEmail,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(RegisterResolver.name);
  }

  @Mutation(() => Boolean!)
  async resentConfirmEmail(@Args("email") email: string): Promise<boolean> {
    const emailConfirmation = await this.emailConfirmationRepository.findByEmail(email);

    try {
      await this.registerEmail.send(emailConfirmation);
      return true;
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }

  @Mutation(() => User!)
  async register(@Args("data") registerInput: RegisterInput, @Context() { ipAddr }: MyContext): Promise<User> {
    const { email, id, password } = registerInput;

    await this.guardAgainstDuplicateUser(email, id);

    const user = await User.create({
      ...registerInput,
      createdIP: ipAddr,
    });

    if (password) await user.setPassword(password);

    await this.userRepository.save(user);

    const emailConfirmation = new EmailConfirmationToken(user);

    await this.emailConfirmationRepository.save(emailConfirmation);

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
