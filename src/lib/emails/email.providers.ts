import { RegisterEmail } from "~/lib/emails/modules/signup/register.email";
import { ForgotPasswordEmail } from "~/lib/emails/modules/auth/forgot_password.email";

export const emailProviders = [RegisterEmail, ForgotPasswordEmail];
