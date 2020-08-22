import { container } from "tsyringe";

import { UserRepository } from "~/lib/repository/user/user_repository";
import { fetch, FetchAPI } from "~/lib/services/http_client.service";

container.register("IUserRepository", {
  useClass: UserRepository,
});

container.register<FetchAPI>("FetchAPI", {
  useValue: fetch,
});

export const Container = container;
