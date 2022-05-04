import { IsString, ValidateNested } from "class-validator";

class OAuthEnvironment {
  @ValidateNested() facebook = new OAuthFacebookEnvironment();
  @ValidateNested() github = new OAuthGithubEnvironment();
  @ValidateNested() google = new OAuthGoogleEnvironment();
}

class OAuthFacebookEnvironment {
  @IsString() clientId = process.env.OAUTH_FACEBOOK_ID!;
  @IsString() clientSecret = process.env.OAUTH_FACEBOOK_SECRET!;
}

class OAuthGoogleEnvironment {
  @IsString() clientId = process.env.OAUTH_GOOGLE_ID!;
  @IsString() clientSecret = process.env.OAUTH_GOOGLE_SECRET!;
}

class OAuthGithubEnvironment {
  @IsString() clientId = process.env.OAUTH_GITHUB_ID!;
  @IsString() clientSecret = process.env.OAUTH_GITHUB_SECRET!;
}

export const OAUTH = new OAuthEnvironment();
