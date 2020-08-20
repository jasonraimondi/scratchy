import { container } from "tsyringe";

import { UserRepository } from "./services/user_repository";
import { fetch, FetchAPI } from "./services/http_client";

container.register("IUserRepository", {
  useClass: UserRepository,
});

container.register<FetchAPI>("FetchAPI", {
  useValue: fetch,
});

export { container };
