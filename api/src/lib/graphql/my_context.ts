import { Request, Response } from "express";
import { User } from "~/app/user/entities/user.entity";

export interface MyContext {
  req: Request | any;
  res: Response | any;
  user?: User;
  ipAddr: string;
}
