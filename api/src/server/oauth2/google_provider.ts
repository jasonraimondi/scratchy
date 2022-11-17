import oauthPlugin from "@fastify/oauth2";
import Axios from "axios";
import { FastifyInstance } from "fastify";

import { handleOAuthLogin, OAuthUser } from "$server/oauth2/auth";
import { OAUTH } from "$config/oauth";
import { Env } from "$config/env";

const NAME = "google";

const CONFIG = {
  name: "google",
  scope: ["email", "profile"],
  credentials: {
    client: {
      id: OAUTH.google.clientId,
      secret: OAUTH.google.clientSecret,
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION,
  },
  // register a fastify url to start the redirect flow
  startRedirectPath: "/api/oauth2/google",
  // google redirect here after the user login
  callbackUri: Env.API_URL + "/oauth2/google/callback",
};

type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

async function fetchGoogleUser(token: string): Promise<OAuthUser> {
  const { data: user } = await Axios.get<GoogleUser>(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  return {
    id: user.id,
    email: user.email,
  };
}

export default function (server: FastifyInstance) {
  server.register(require("@fastify/oauth2"), CONFIG);

  server.get(`/api/oauth2/${NAME}/callback`, async (req, res) => {
    return handleOAuthLogin(req, res, NAME, server[NAME], fetchGoogleUser);
  });
}
