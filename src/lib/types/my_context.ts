import { Request, Response } from "express";
import { User } from "~/entity/user/user.entity";
import { AuthContext } from "~/lib/middlewares/is_auth";

export interface MyContext {
  req: Request | any;
  res: Response | any;
  container: any;
  auth?: AuthContext;
  currentUser?: User;
  ipAddr?: string;
}
