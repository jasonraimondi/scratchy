import { RegisterEmail } from "~/modules/email/emails/register.email";
import { ForgotPasswordEmail } from "~/modules/email/emails/forgot_password.email";

export const emailProviders = [RegisterEmail, ForgotPasswordEmail];
