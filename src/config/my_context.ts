import { Request, Response } from "express";
// import { User } from "~/entity/user/user.entity";

export interface MyContext {
  req: Request | any;
  res: Response | any;
  // container: any;
  // auth?: any;
  // currentUser?: User;
  ipAddr?: string;
}
