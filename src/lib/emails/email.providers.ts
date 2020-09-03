import { ForgotPasswordEmail } from "~/lib/emails/modules/auth/forgot_password.email";
import { RegisterEmail } from "~/lib/emails/modules/signup/register.email";

export const emailProviders = [RegisterEmail, ForgotPasswordEmail];
