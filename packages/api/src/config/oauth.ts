import oauthPlugin, { FastifyOAuth2Options } from "fastify-oauth2";

import { ENV } from "~/config/environments";

export const OAuthProviders: FastifyOAuth2Options[] = [
  {
    name: "GitHub",
    scope: ["user:email"],
    credentials: {
      client: {
        id: ENV.oauth.github.clientId,
        secret: ENV.oauth.github.clientSecret,
      },
      auth: oauthPlugin.GITHUB_CONFIGURATION
    },
    // register a fastify url to start the redirect flow
    startRedirectPath: "/oauth2/github",
    // redirect here after the user login
    callbackUri: ENV.oauth.github.callbackURL
  },
  {
    name: "Google",
    scope: ["email", "profile"],
    credentials: {
      client: {
        id: ENV.oauth.google.clientId,
        secret: ENV.oauth.google.clientSecret
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION
    },
    // register a fastify url to start the redirect flow
    startRedirectPath: "/oauth2/google",
    // redirect here after the user login
    callbackUri: ENV.oauth.google.callbackURL
  },
];
