import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";

@Injectable()
export class OtpService {
  constructor(private readonly secret: string) {}

  generate(): string {
    return authenticator.generate(this.secret);
  }

  verify(token: string): boolean {
    return authenticator.verify({ secret: this.secret, token });
  }
}
