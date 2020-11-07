import { User as ScratchyUser } from "./src/app/user/entities/user.entity";

declare namespace Express {
  export type User = ScratchyUser;
  export interface Request {
    user?: User;
  }
}
