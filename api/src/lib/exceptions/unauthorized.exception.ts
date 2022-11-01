import { UnauthorizedException as NestUnauthorizedException } from "@nestjs/common";

export class UnauthorizedException extends NestUnauthorizedException {
  static invalidUser(message?: string) {
    return new UnauthorizedException(message ?? "invalid user");
  }
}
