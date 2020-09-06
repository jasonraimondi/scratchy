import { ForgotPasswordEmail } from "~/lib/emails/modules/auth/forgot_password.email";
import { RegisterEmail } from "~/lib/emails/modules/signup/register.email";
import { EmailService } from "~/lib/emails/services/email.service";
import { EmailTemplateService } from "~/lib/emails/services/email_template.service";

export const emailProviders = [EmailService, EmailTemplateService, RegisterEmail, ForgotPasswordEmail];
