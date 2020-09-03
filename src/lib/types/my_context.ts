import { Request, Response } from "express";
import { AuthContext } from "~/lib/middlewares/is_auth";

export interface MyContext {
  req: Request | any;
  res: Response | any;
  container: any;
  auth?: AuthContext;
}
