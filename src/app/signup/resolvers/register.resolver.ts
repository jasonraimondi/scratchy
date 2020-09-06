import { Inject, Logger } from "@nestjs/common";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import { RegisterInput } from "~/app/user/dtos/register.input";
import { RegisterResponse } from "~/app/user/dtos/register.response";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/lib/config/keys";
import { RegisterEmail } from "~/lib/emails/modules/signup/register.email";
import { IEmailConfirmationRepository } from "~/lib/repositories/user/email_confirmation.repository";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/lib/config/my_context";

@Resolver()
export class RegisterResolver {
  private readonly logger = new Logger(RegisterResolver.name);

  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    @Inject(REPOSITORY.EmailConfirmationRepository) private emailConfirmationRepository: IEmailConfirmationRepository,
    private registerEmail: RegisterEmail,
  ) {}

  @Mutation(() => Boolean!)
  async resentConfirmEmail(@Arg("email") email: string): Promise<boolean> {
    const emailConfirmation = await this.emailConfirmationRepository.findByEmail(email);

    try {
      await this.registerEmail.send(emailConfirmation);
      return true;
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }

  @Mutation(() => RegisterResponse!)
  async register(@Arg("data") registerInput: RegisterInput, @Ctx() { ipAddr }: MyContext): Promise<RegisterResponse> {
    registerInput.email = registerInput.email.toLowerCase();

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

    return { user };
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
