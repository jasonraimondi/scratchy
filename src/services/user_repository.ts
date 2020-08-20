import { inject, injectable } from "tsyringe";
import { FetchAPI } from "~/services/http_client";

export interface IUserRepository {
  getUser(): Promise<string>;
}

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject("FetchAPI") private fetch: FetchAPI) {}

  async getUser(): Promise<string> {
    const res = await this.fetch("https://syntax.fm/api/shows/275");
    const json = await res.json();
    // const json = {};
    return JSON.stringify(json);
  }
}
