import { ForgotPasswordEmail } from "~/app/emails/emails/forgot_password.email";
import { RegisterEmail } from "~/app/emails/emails/register.email";
import { EmailService } from "~/app/emails/services/email.service";
import { EmailTemplateService } from "~/app/emails/services/email_template.service";

export const emailProviders = [EmailService, EmailTemplateService, RegisterEmail, ForgotPasswordEmail];
