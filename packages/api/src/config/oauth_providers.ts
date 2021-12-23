import oauthPlugin, { FastifyOAuth2Options } from "fastify-oauth2";

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
    startRedirectPath: "/oauth2/facebook", // registers a fastify get route
    callbackUri: ENV.oauth.facebook.callbackURL,
  },
  {
    name: "github",
    scope: ["user:email"],
    credentials: {
      client: {
        id: ENV.oauth.github.clientId,
        secret: ENV.oauth.github.clientSecret,
      },
      auth: oauthPlugin.GITHUB_CONFIGURATION,
    },
    startRedirectPath: "/oauth2/github", // registers a fastify get route
    callbackUri: ENV.oauth.github.callbackURL,
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
    startRedirectPath: "/oauth2/google", // registers a fastify get route
    callbackUri: ENV.oauth.google.callbackURL,
  },
];
