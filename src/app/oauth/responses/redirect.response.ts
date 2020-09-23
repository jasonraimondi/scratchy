import { HttpStatus } from "@nestjs/common";
import { Response } from "express";

import { OAuthException } from "~/app/oauth/exceptions/oauth.exception";
import { AbstractResponse } from "~/app/oauth/responses/abstract.response";

export class RedirectResponse extends AbstractResponse {
  constructor(private readonly _redirectUri: string) {
    super();
  }

  async generateHttpResponse(response: Response) {
    if (!this._redirectUri) throw OAuthException.missingRedirectUri();
    return response.redirect(HttpStatus.FOUND, this._redirectUri);
  }
}
