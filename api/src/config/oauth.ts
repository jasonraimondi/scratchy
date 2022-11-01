import { EnvSchema } from "~/config/environments/base";

export default {
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
} as EnvSchema["oauth"];
