import { Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";

import { User } from "~/app/user/entities/user.entity";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { MyJwtService } from "~/lib/jwt/jwt.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userRepository: UserRepository, private readonly jwt: MyJwtService) {}

  async use(req: FastifyRequest, res: FastifyReply, next: any) {
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
