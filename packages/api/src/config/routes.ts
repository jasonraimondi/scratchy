import { route } from "@jmondi/route-strings";

export const WEB_ROUTES = {
  oauth_callback: route("/login/callback?encoded_token=:encodedToken"),
  verify_email: route("/email_confirmation?e=:email&u=:id"),
  forgot_password: route("/reset_password?e=:email&u=:id"),
};
