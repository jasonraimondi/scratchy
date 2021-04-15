import { ForgotPasswordEmail } from "~/lib/email/emails/forgot_password.email";
import { RegisterEmail } from "~/lib/email/emails/register.email";
import { EmailService } from "~/lib/email/services/email.service";
import { EmailTemplateService } from "~/lib/email/services/email_template.service";

export const emailProviders = [EmailService, EmailTemplateService, RegisterEmail, ForgotPasswordEmail];
