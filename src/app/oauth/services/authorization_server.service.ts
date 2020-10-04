import { AuthorizationServer as JmondiAuthorizationServer, JwtService } from "@jmondi/oauth2-server";
import { AuthCodeRepo } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { TokenRepo } from "~/app/oauth/repositories/token.repository";

export class AuthorizationServer extends JmondiAuthorizationServer {
  static register() {
    return {
      provide: AuthorizationServer,
      useFactory: (
        authCodeRepo: AuthCodeRepo,
        clientRepo: ClientRepo,
        tokenRepo: TokenRepo,
        scopeRepo: ScopeRepo,
        userRepo: OAuthUserRepo,
      ) =>
        new AuthorizationServer(
          authCodeRepo,
          clientRepo,
          tokenRepo,
          scopeRepo,
          userRepo,
          new JwtService("super secret"),
        ),
      inject: [AuthCodeRepo, ClientRepo, TokenRepo, ScopeRepo, OAuthUserRepo],
    };
  }
}
