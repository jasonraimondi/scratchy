import { RouteGroup } from "@jmondi/route-strings";
import { Env } from "$config/env";

const webRoutes = new RouteGroup({ prefix: Env.APP_URL });

export const WEB_ROUTES = {
  oauth_callback: webRoutes.add("/login/callback?token=:token"),
  verify_email: webRoutes.add("/email_confirmation?email=:email&token=:token"),
  forgot_password: webRoutes.add("/reset_password?email=:email&token=:token"),
};
