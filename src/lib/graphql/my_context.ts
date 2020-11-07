import { Request, Response } from "express";

export interface MyContext {
  req: Request | any;
  res: Response | any;
  ipAddr: string;
}
