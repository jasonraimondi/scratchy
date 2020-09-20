import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { AuthorizationCodeRepo } from "~/app/oauth/repositories/authorization_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { RefreshTokenRepo } from "~/app/oauth/repositories/refresh_token.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";

export const repositoryProviders = [ClientRepo, AccessTokenRepo, RefreshTokenRepo, AuthorizationCodeRepo, ScopeRepo];
