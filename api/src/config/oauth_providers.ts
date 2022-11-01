import oauthPlugin, { FastifyOAuth2Options } from "@fastify/oauth2";

import { ENV } from "~/config/environment";

export const OAuthProviders: FastifyOAuth2Options[] = [
  {
    name: "facebook",
    scope: ["email"],
    credentials: {
      client: {
        id: ENV.oauth.facebook.clientId,
        secret: ENV.oauth.facebook.clientSecret,
      },
      auth: oauthPlugin.FACEBOOK_CONFIGURATION,
    },
    startRedirectPath: "/api/oauth2/facebook", // registers a fastify get route
    callbackUri: ENV.urlApi + "/oauth2/facebook/callback",
  },
  {
    name: "github",
    scope: ["read:user", "user:email"],
    credentials: {
      client: {
        id: ENV.oauth.github.clientId,
        secret: ENV.oauth.github.clientSecret,
      },
      auth: oauthPlugin.GITHUB_CONFIGURATION,
    },
    startRedirectPath: "/api/oauth2/github", // registers a fastify get route
    callbackUri: ENV.urlApi + "/oauth2/github/callback",
  },
  {
    name: "google",
    scope: ["email", "profile"],
    credentials: {
      client: {
        id: ENV.oauth.google.clientId,
        secret: ENV.oauth.google.clientSecret,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/api/oauth2/google", // registers a fastify get route
    callbackUri: ENV.urlApi + "/oauth2/google/callback",
  },
];
