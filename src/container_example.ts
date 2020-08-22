import { Container } from "./container";
import { GetUserHandler } from "./handlers/get_user";

const client = Container.resolve<GetUserHandler>(GetUserHandler);

client.bar().then(console.log);
