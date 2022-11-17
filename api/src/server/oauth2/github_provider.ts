import { FastifyInstance } from "fastify";
import oauthPlugin from "@fastify/oauth2";
import { Octokit } from "octokit";

import { handleOAuthLogin, OAuthUser } from "$server/oauth2/auth";
import { OAUTH } from "$config/oauth";
import { Env } from "$config/env";

const NAME = "github";

const CONFIG = {
  name: "github",
  scope: ["read:user", "user:email"],
  credentials: {
    client: {
      id: OAUTH.github.clientId,
      secret: OAUTH.github.clientSecret,
    },
    auth: oauthPlugin.GITHUB_CONFIGURATION,
  },
  // register a fastify url to start the redirect flow
  startRedirectPath: "/api/oauth2/github",
  // github redirect here after the user login
  callbackUri: Env.API_URL + "/oauth2/github/callback",
};

async function fetchGitHubUser(token: string): Promise<OAuthUser> {
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.rest.users.getAuthenticated();

  return {
    id: data.id.toString(),
    email: data.email,
    nickname: data.name,
  };
}

export default function (server: FastifyInstance) {
  server.register(require("@fastify/oauth2"), CONFIG);

  server.get(`/api/oauth2/${NAME}/callback`, async (req, res) => {
    return handleOAuthLogin(req, res, NAME, server[NAME], fetchGitHubUser);
  });
}
