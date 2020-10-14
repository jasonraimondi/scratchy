import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

import { MyJwtService } from "~/app/oauth/services/jwt.service";
import { User } from "~/entity/user/user.entity";
import { UserRepo } from "~/lib/repositories/user/user.repository";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userRepository: UserRepo, private readonly jwt: MyJwtService) {}

  async use(req: Request, res: Response, next: any) {
    if (!!req.cookies.jwt) {
      req.user = await this.getUserFromToken(req.cookies.jwt);
    }

    next();
  }

  async getUserFromToken(token: string): Promise<User | undefined> {
    try {
      const decoded: any = await this.jwt.verify(token);
      if (decoded?.userId) {
        return await this.userRepository.findById(decoded.userId);
      }
    } catch (e) {}

    return;
  }
}
