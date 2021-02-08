import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ForgotPasswordToken } from "~/app/account/entities/forgot_password.entity";
import { BaseRepo } from "~/app/database/base.repository";

@Injectable()
export class ForgotPasswordRepo extends BaseRepo<ForgotPasswordToken> {
  constructor(@InjectRepository(ForgotPasswordToken) userRepository: Repository<ForgotPasswordToken>) {
    super(userRepository);
  }

  async findById(id: string) {
    return super.findById(id, {
      join: {
        alias: "forgot_password_token",
        leftJoinAndSelect: {
          user: "forgot_password_token.user",
        },
      },
    });
  }

  findForUser(userId: string): Promise<ForgotPasswordToken> {
    return this.repository.findOneOrFail({
      where: {
        userId: userId,
      },
      join: {
        alias: "forgot_password_token",
        leftJoinAndSelect: {
          user: "forgot_password_token.user",
        },
      },
    });
  }
}
