import { Provider } from "@nestjs/common";

import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { TokenRepo } from "~/app/oauth/repositories/token.repository";
import { AuthCodeRepo } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { GoogleStrategy } from "~/app/oauth/strategies/google.strategy";
import { GithubStrategy } from "~/app/oauth/strategies/github.strategy";
import { JwtStrategy } from "~/app/oauth/strategies/jwt.strategy";

export const repositories: Provider[] = [ClientRepo, TokenRepo, AuthCodeRepo, ScopeRepo, OAuthUserRepo];

export const strategies: Provider[] = [GoogleStrategy, GithubStrategy, JwtStrategy];
