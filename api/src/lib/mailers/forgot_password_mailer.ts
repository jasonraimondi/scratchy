import { WEB_ROUTES } from "$config/urls";
import { queueEmail } from "$lib/queues/email_queue";

export type ForgotPasswordMailerInput = {
  email: string;
  token: string;
};

export async function forgotPasswordMailer(input: ForgotPasswordMailerInput) {
  const templateInput = {
    url: WEB_ROUTES.forgot_password.create({
      email: input.email,
      token: input.token,
    }),
  };
  await queueEmail({
    to: input.email,
    subject: "Forgot your password?",
    html: template(templateInput),
  });
}

type TemplateInput = {
  url: string;
};

export function template({ url }: TemplateInput) {
  return `
<p>Reset your password <a href="${url}">Click Here</a></p>
  `;
}
