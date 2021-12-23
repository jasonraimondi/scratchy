import { IsString, ValidateNested } from "class-validator";

class OAuthEnvironment {
  @ValidateNested() facebook = new OAuthFacebookEnvironment();
  @ValidateNested() github = new OAuthGithubEnvironment();
  @ValidateNested() google = new OAuthGoogleEnvironment();
}

class OAuthFacebookEnvironment {
  @IsString() clientId = process.env.OAUTH_FACEBOOK_ID!;
  @IsString() clientSecret = process.env.OAUTH_FACEBOOK_SECRET!;
  @IsString() callbackURL = "/api/oauth2/facebook/callback";
}

class OAuthGoogleEnvironment {
  @IsString() clientId = process.env.OAUTH_GOOGLE_ID!;
  @IsString() clientSecret = process.env.OAUTH_GOOGLE_SECRET!;
  @IsString() callbackURL = "/api/oauth2/google/callback";
}

class OAuthGithubEnvironment {
  @IsString() clientId = process.env.OAUTH_GITHUB_ID!;
  @IsString() clientSecret = process.env.OAUTH_GITHUB_SECRET!;
  @IsString() callbackURL = "/api/oauth2/facebook/callback";
}

export const OAUTH = new OAuthEnvironment();
