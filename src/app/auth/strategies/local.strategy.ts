import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from "~/app/auth/services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      console.log(username, password)
      const user = await this.authService.validateUser(username, password);
      if (user) return user;
    } catch (_) {
    }
    throw new UnauthorizedException();
  }
}
