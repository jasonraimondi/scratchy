import { Injectable } from "@nestjs/common";
import { JwtInterface } from "@jmondi/oauth2-server";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class MyJwtService implements JwtInterface {
  constructor(private readonly jwt: JwtService) {}

  decode(encryptedData: string): { [p: string]: any } | string | null {
    return this.jwt.decode(encryptedData);
  }

  sign(payload: string | Buffer | Record<string, unknown> | any): Promise<string> {
    return this.jwt.signAsync(payload);
  }

  verify(token: string): Promise<Record<string, unknown>> {
    return this.jwt.verifyAsync(token);
  }
}
