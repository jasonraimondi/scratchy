import { FastifyInstance } from "fastify";
import { handleOAuthLogin, OAuthUser } from "$server/oauth2/auth";
import { OAUTH } from "$config/oauth";
import oauthPlugin from "@fastify/oauth2";
import { Env } from "$config/env";
import axios from "axios";

const NAME = "facebook";

const CONFIG = {
  name: "facebook",
  scope: ["email"],
  credentials: {
    client: {
      id: OAUTH.facebook.clientId,
      secret: OAUTH.facebook.clientSecret,
    },
    auth: oauthPlugin.FACEBOOK_CONFIGURATION,
  },
  // register a fastify url to start the redirect flow
  startRedirectPath: "/api/oauth2/facebook",
  // facebook redirect here after the user login
  callbackUri: Env.API_URL + "/oauth2/facebook/callback",
};

type FacebookUser = {
  email: string;
  name: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  id: string;
};

async function fetchFacebookUser(token: string): Promise<OAuthUser> {
  const { data: user } = await axios.get<FacebookUser>(
    "https://graph.facebook.com/me?fields=email,name,picture",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  return {
    id: user.id,
    nickname: user.name,
    email: user.email,
    image: user.picture.data.url,
  };
}

export default function (server: FastifyInstance) {
  server.register(require("@fastify/oauth2"), CONFIG);

  server.get(`/api/oauth2/${NAME}/callback`, async (req, res) => {
    return handleOAuthLogin(req, res, NAME, server[NAME], fetchFacebookUser);
  });
}
