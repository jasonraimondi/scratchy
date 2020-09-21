import { AccessToken } from "~/app/oauth/entities/access_token.entity";

export class AbstractResponse {
  protected accessToken: AccessToken;
  protected refreshToken: AccessToken;
  protected privateKey: any;
}
