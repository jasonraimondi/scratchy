import { Provider } from "@nestjs/common";
import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { AuthCodeRepo } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { RefreshTokenRepo } from "~/app/oauth/repositories/refresh_token.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";

export const repositoryProviders: Provider[] = [ClientRepo, AccessTokenRepo, RefreshTokenRepo, AuthCodeRepo, ScopeRepo];
