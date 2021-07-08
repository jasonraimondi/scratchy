import { route } from "~/lib/utils/route";

export const WEB_ROUTES = {
  verify_email: route("/verify_email?e=:email&u=:id"),
  forgot_password: route("/reset_password?e=:email&u=:id"),
};

export const API_ROUTES = {
  authorize: route("/oauth2/authorize"),
  login: route("/oauth2/login"),
  scopes: route("/oauth2/scopes"),
  // verify_email: route("/auth/email_confirmation?e=:email&u=:id"),
  // forgot_password: route("/auth/reset_password?e=:email&u=:id"),
};
