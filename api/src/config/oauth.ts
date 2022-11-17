import { z } from "zod";
import type { Provider } from "$generated/client";

const OAuthEnv = z.object({ clientId: z.string(), clientSecret: z.string() });
type OAuthEnv = z.infer<typeof OAuthEnv>;

export type OAuthSchema = Record<Provider, OAuthEnv>;

export const OAUTH: OAuthSchema = {
  facebook: {
    clientId: process.env.OAUTH_FACEBOOK_ID as string,
    clientSecret: process.env.OAUTH_FACEBOOK_SECRET as string,
  },
  github: {
    clientId: process.env.OAUTH_GITHUB_ID as string,
    clientSecret: process.env.OAUTH_GITHUB_SECRET as string,
  },
  google: {
    clientId: process.env.OAUTH_GOOGLE_ID as string,
    clientSecret: process.env.OAUTH_GOOGLE_SECRET as string,
  },
};
