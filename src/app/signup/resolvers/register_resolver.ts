import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Inject } from "@nestjs/common";
import { REPOSITORY } from "~/lib/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { IEmailConfirmationRepository } from "~/lib/repositories/user/email_confirmation.repository";
import { RegisterEmail } from "~/lib/emails/modules/signup/register.email";
import { RegisterResponse } from "~/app/user/dtos/register_response";
import { RegisterInput } from "~/app/user/dtos/register_input";
import { User } from "~/entity/user/user_entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";
import { MyContext } from "~/lib/types/my_context";

@Resolver()
export class RegisterResolver {
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
      console.error(e);
    }
    return false;
  }

  @Mutation(() => RegisterResponse!)
  async register(@Arg("data") registerInput: RegisterInput, @Ctx() { req }: MyContext): Promise<RegisterResponse> {
    registerInput.email = registerInput.email.toLowerCase();
    const createdIp = req.headers?.["x-forwarded-for"] || req.connection.remoteAddress;
    const { email, id, password } = registerInput;
    await this.guardAgainstDuplicateUser(email, id);
    const user = await User.create({
      ...registerInput,
      createdIP: createdIp,
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
