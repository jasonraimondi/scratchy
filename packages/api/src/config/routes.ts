import { route } from "~/lib/utils/route";

export const WEB_ROUTES = {
  verify_email: route("/verify_email?e=:email&u=:id"),
  forgot_password: route("/reset_password?e=:email&u=:id"),
};
