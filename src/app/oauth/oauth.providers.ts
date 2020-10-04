import { Provider } from "@nestjs/common";

import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { TokenRepo } from "~/app/oauth/repositories/token.repository";
import { AuthCodeRepo } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";

export const repositoryProviders: Provider[] = [ClientRepo, TokenRepo, AuthCodeRepo, ScopeRepo, OAuthUserRepo];
