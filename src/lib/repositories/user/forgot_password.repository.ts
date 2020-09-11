import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { BaseRepository, IBaseRepo } from "~/lib/repositories/base.repository";

export interface IForgotPasswordRepository extends IBaseRepo<ForgotPasswordToken> {
  findForUser(userId: string): Promise<ForgotPasswordToken>;
}

export class ForgotPasswordRepository extends BaseRepository<ForgotPasswordToken> implements IForgotPasswordRepository {
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
        user: userId,
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
