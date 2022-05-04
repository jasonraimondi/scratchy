import { Route } from "@jmondi/route-strings";

export const WEB_ROUTES = {
  oauth_callback: new Route<{ encodedToken: string }>("/login/callback?encoded_token=:encodedToken"),
  verify_email: new Route<{ email: string; id: string }>("/email_confirmation?e=:email&u=:id"),
  forgot_password: new Route<{ email: string; id: string }>("/reset_password?e=:email&u=:id"),
};

export const S3_PATHS = {
  image: new Route<{ userId: string; fileUploadId: string }>("/users/:userId/:fileUploadId.png"),
};
