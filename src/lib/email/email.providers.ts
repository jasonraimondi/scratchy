import { RegisterEmail } from "~/lib/email/modules/signup/register.email";
import { ForgotPasswordEmail } from "~/lib/email/modules/auth/forgot_password.email";

export const emailProviders = [RegisterEmail, ForgotPasswordEmail];
