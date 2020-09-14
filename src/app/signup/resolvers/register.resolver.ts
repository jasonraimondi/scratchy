import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { RegisterInput } from "~/app/user/dtos/register.input";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { User } from "~/entity/user/user.entity";

import { RegisterEmail } from "~/lib/emails/modules/signup/register.email";
import { LoggerService } from "~/lib/logger/logger.service";
import { EmailConfirmationRepo } from "~/lib/repositories/user/email_confirmation.repository";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/config/my_context";

@Resolver()
export class RegisterResolver {
  constructor(
    private userRepository: UserRepo,
    private emailConfirmationRepository: EmailConfirmationRepo,
    private registerEmail: RegisterEmail,
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
