import { RegisterEmail } from "~/modules/email/modules/signup/register.email";
import { ForgotPasswordEmail } from "~/modules/email/modules/auth/forgot_password.email";

export const emailProviders = [RegisterEmail, ForgotPasswordEmail];
