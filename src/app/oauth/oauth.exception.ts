import { HttpException, HttpStatus } from "@nestjs/common";

export class OAuthException extends HttpException {
  private constructor(response: string | Record<string, any>, status: number) {
    super(`oauth exception: ${response.toString()}`, status);
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
}
