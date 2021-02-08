import { Injectable } from "@nestjs/common";
import { JwtInterface } from "@jmondi/oauth2-server";
import { JwtService } from "@nestjs/jwt";
import { JwtSignOptions } from "@nestjs/jwt/dist/interfaces/jwt-module-options.interface";

@Injectable()
export class MyJwtService implements JwtInterface {
  constructor(private readonly jwt: JwtService) {}

  decode(encryptedData: string): { [p: string]: any } | string | null {
    return this.jwt.decode(encryptedData);
  }

  sign(payload: string | Buffer | Record<string, unknown> | any, options?: JwtSignOptions): Promise<string> {
    return this.jwt.signAsync(payload, options);
  }

  verify<Payload = Record<string, unknown>>(token: string): Promise<Payload> {
    // @ts-ignore
    return this.jwt.verifyAsync(token);
  }
}
