import { Injectable } from '@nestjs/common';

import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { MyJwtService } from "~/app/jwt/jwt.service";
import { User } from "~/app/user/entities/user.entity";
import { TokenPayload } from "~/app/auth/strategies/jwt.strategy";

@Injectable()
export class AuthService {
  constructor(private usersService: UserRepo, private jwtService: MyJwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    await user.verify(pass);
    return user;
  }

  async login(user: User) {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };
    return {
      accessToken: await this.jwtService.sign(payload),
    };
  }
}