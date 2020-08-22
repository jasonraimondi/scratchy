import { inject, injectable } from "tsyringe";

import { FetchAPI } from "~/services/http_client";

export interface IExternalIntegration {
  getShows(): Promise<string>;
}

@injectable()
export class ExternalIntegrationService implements IExternalIntegration {
  constructor(@inject("FetchAPI") private fetch: FetchAPI) {}

  async getShows(): Promise<string> {
    const res = await this.fetch("https://syntax.fm/api/shows/275");
    const json = await res.json();
    // const json = {};
    return JSON.stringify(json);
  }
}
