import { HttpException, HttpStatus } from "@nestjs/common";

export class OAuthException extends HttpException {
  constructor(response: string | Record<string, any>, status: number, redirectUri?: string) {
    super(`oauth exception: ${response.toString()}`, status);
  }

  static missingRedirectUri() {
    return new OAuthException("missing redirect uri", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  static invalidRequest(missingFields?: string | string[]): OAuthException {
    missingFields = missingFields ? " missing: (" + missingFields.toString() + ")" : "";
    return new OAuthException("invalid request" + missingFields, HttpStatus.NOT_ACCEPTABLE);
  }

  static errorValidatingClient() {
    return new OAuthException("error validating client", HttpStatus.FORBIDDEN);
  }

  static invalidGrant() {
    return new OAuthException("invalid grant_type", HttpStatus.NOT_ACCEPTABLE);
  }

  static unsupportedGrantType() {
    console.error("UNSUPPORTED GRANT TYPE");

    return new OAuthException("unsupported grant_type", HttpStatus.NOT_ACCEPTABLE);
  }

  static invalidClient() {
    return new OAuthException("client authentication failed", HttpStatus.NOT_ACCEPTABLE);
  }

  static invalidScopes(invalidScopes: string[], redirectUri?: string) {
    return new OAuthException(`invalid scopes: (${invalidScopes.join(" ")})`, HttpStatus.NOT_ACCEPTABLE, redirectUri);
  }
}