import { Route, RouteGroup } from "@jmondi/route-strings";

import { ENV } from "~/config/environment";

const webRoutes = new RouteGroup({ prefix: ENV.urlWeb });

export const WEB_ROUTES = {
  oauth_callback: webRoutes.add("/login/callback?encoded_token=:encodedToken"),
  verify_email: webRoutes.add("/email_confirmation?e=:email&u=:id"),
  forgot_password: webRoutes.add("/reset_password?e=:email&u=:id"),
};

export const S3_PATHS = {
  image: new Route("/users/:userId/:fileUploadId"),
};
