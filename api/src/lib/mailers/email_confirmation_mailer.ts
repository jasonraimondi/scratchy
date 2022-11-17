import { WEB_ROUTES } from "$config/urls";
import { queueEmail } from "$lib/queues/email_queue";

export type EmailConfirmationMailerInput = {
  email: string;
  token: string;
};

export async function emailConfirmationMailer(input: EmailConfirmationMailerInput) {
  const templateVars = {
    url: WEB_ROUTES.verify_email.create(input),
  };
  await queueEmail({
    to: input.email,
    subject: "Verify Your Email",
    html: template(templateVars),
  });
}

export function template({ url }: any) {
  return `
<p>Verify your account <a href="${url}">${url}</a></p>
  `;
}
