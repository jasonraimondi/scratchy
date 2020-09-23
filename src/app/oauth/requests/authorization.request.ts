import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { GrantId } from "~/app/oauth/grants/abstract.grant";
import { User } from "~/entity/user/user.entity";

export class AuthorizationRequest {
  scopes: Scope[] = [];
  isAuthorizationApproved: boolean;
  redirectUri?: string;
  state?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;

  constructor(public readonly grantTypeId: GrantId, public readonly client: Client, public user?: User) {
    this.scopes = [];
    this.isAuthorizationApproved = false;
  }
}
