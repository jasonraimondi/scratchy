import "reflect-metadata";

import { container } from "./container";
import { GetUserHandler } from "./handlers/get_user";

const client = container.resolve<GetUserHandler>(GetUserHandler);

client.bar().then(console.log);
