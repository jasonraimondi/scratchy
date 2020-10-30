import { User as ScratchyUser } from "~/entity/user/user.entity";

declare namespace Express {
  export type User = ScratchyUser;
  export interface Request {
    user?: User;
  }
}
