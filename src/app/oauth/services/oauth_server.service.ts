import { Injectable } from "@nestjs/common";
import { OAuthModelService } from "~/app/oauth/services/oauth_model.service";
import OAuth2Server from "oauth2-server";

@Injectable()
export class OAuthServerService extends OAuth2Server {
  constructor(options: OAuth2Server.ServerOptions) {
    super(options);
  }

  static forFeature() {
    return {
      provide: OAuthServerService,
      useFactory: (model: OAuthModelService) => new OAuthServerService({ model }),
      inject: [OAuthModelService],
    };
  }
}
