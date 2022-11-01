import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { RegisterInput } from "~/app/user/register/register.input";
import { EmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { User } from "~/entities/user.entity";
import { RegisterMailer } from "~/lib/email/mailers/register.mailer";
import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { MyContext } from "~/config/graphql";

@Resolver()
export class RegisterResolver {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly mailer: RegisterMailer,
  ) {}

  @Mutation(() => User!)
  async register(@Args("input") data: RegisterInput, @Context() { ipAddr }: MyContext): Promise<User> {
    return await this.registerUser(data, ipAddr);
  }

  @Mutation(() => Boolean!)
  async resendConfirmEmail(@Args("email") email: string): Promise<boolean> {
    const emailConfirmation = await this.emailConfirmationRepository.findByEmail(email);
    await this.mailer.send(emailConfirmation);
    return true;
  }

  private async registerUser(registerInput: RegisterInput, ipAddr: string) {
    await this.guardAgainstDuplicateUser(registerInput.email, registerInput.id);

    const user = await User.create({
      ...registerInput,
      createdIP: ipAddr,
      password: registerInput.password,
    });

    const emailConfirmation = EmailConfirmationToken.create({ user, userId: user.id });

    await this.userRepository.create(user);

    await this.emailConfirmationRepository.create(emailConfirmation);

    await this.mailer.send(emailConfirmation);

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
