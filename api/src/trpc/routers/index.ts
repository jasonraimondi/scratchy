import { registerRouter } from "$trpc/routers/register";
import { updatePasswordRouter } from "$trpc/routers/update_password";
import { emailConfirmationRouter } from "$trpc/routers/email_confirmation";
import { subRouter } from "$trpc/routers/sub";
import { meRouter } from "$trpc/routers/me";
import { authRouter } from "$trpc/routers/auth";
import { forgotPasswordRouter } from "$trpc/routers/forgot_password";
import { router } from "$trpc/trpc";
import { printRouter } from "$trpc/routers/prints";
import { userRouter } from "$trpc/routers/users";

export const appRouter = router({
  sub: subRouter,

  auth: authRouter,
  emailConfirmation: emailConfirmationRouter,
  forgotPassword: forgotPasswordRouter,
  me: meRouter,
  register: registerRouter,
  updatePassword: updatePasswordRouter,
  print: printRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
