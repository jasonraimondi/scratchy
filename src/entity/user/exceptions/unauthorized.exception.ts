import { UnauthorizedException as NestUnauthorizedException } from "@nestjs/common";

export class UnauthorizedException extends NestUnauthorizedException {
  public static invalidUser(details?: string) {
    return new UnauthorizedException("invalid user", details);
  }
}
