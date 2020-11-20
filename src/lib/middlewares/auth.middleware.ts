import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { MyJwtService } from "~/app/jwt/jwt.service";

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
