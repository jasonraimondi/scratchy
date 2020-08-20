import { inject, injectable } from "tsyringe";

import { IUserRepository } from "~/services/user_repository";

@injectable()
export class GetUserHandler {
  constructor(@inject("IUserRepository") private service: IUserRepository) {}

  async bar(): Promise<string> {
    return this.service.getUser();
  }
}
