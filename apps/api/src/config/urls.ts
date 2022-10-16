import { Route } from "@jmondi/route-strings";

export const WEB_ROUTES = {
  oauth_callback: new Route("/login/callback?encoded_token=:encodedToken"),
  verify_email: new Route("/email_confirmation?e=:email&u=:id"),
  forgot_password: new Route("/reset_password?e=:email&u=:id"),
};

export const S3_PATHS = {
  image: new Route("/users/:userId/:fileUploadId"),
};
