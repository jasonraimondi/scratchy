import { z } from "zod";
import { publicProcedure, router } from "$trpc/trpc";
import { RegisterService } from "$lib/services/register_service";
import { prismaUserTokenByEmail } from "$db/user_token";
import { UserTokenType } from "$generated/client";
import { PasswordSchema } from "$trpc/routers/update_password";
import { emailConfirmationMailer } from "$lib/mailers/email_confirmation_mailer";

export const RegisterSchema = z.object({
  id: z.string().uuid().optional(),
  password: PasswordSchema.nullish(),
  nickname: z.string().min(1).nullish(),
  email: z.string().email(),
});
export type RegisterSchema = z.infer<typeof RegisterSchema>;
export const RegisterSchemaWithIP = RegisterSchema.and(
  z.object({
    createdIP: z.string(),
  }),
);
export type RegisterSchemaWithIP = z.infer<typeof RegisterSchemaWithIP>;

export const registerRouter = router({
  register: publicProcedure.input(RegisterSchema).mutation(async ({ input, ctx }) => {
    const { user, emailConfirmation } = await RegisterService.register({
      ...input,
      createdIP: ctx.ipAddr,
    });
    await emailConfirmationMailer({
      email: user.email,
      token: emailConfirmation.id,
    });
    return user;
  }),
  resendConfirmEmail: publicProcedure.input(z.string()).mutation(async ({ input: email }) => {
    const emailConfirmation = await prismaUserTokenByEmail({
      email,
      type: UserTokenType.emailConfirmation,
    });
    console.log(emailConfirmation);
    // @todo send mail

    // await this.mailer.send(emailConfirmation);
  }),
});
