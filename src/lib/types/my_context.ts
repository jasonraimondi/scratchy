import { Request, Response } from "express";
import { TestingModule } from "@nestjs/testing";

export interface MyContext {
  req: Request | any;
  res: Response | any;
  auth?: {
    userId: string;
    email: string;
    isEmailConfirmed: boolean;
  };
  container: TestingModule
}
