import { TestingModule } from "@nestjs/testing";

interface IMockContent {
  container: TestingModule;
  res?: any;
  req?: any;
  auth?: any;
}

export const mockContext = ({ res = mockRequest(), req = mockRequest(), ...context }: IMockContent) => ({
  res,
  req,
  ...context,
});

export const mockRequest = (authHeader?: string, sessionData = {}): any => ({
  get: jest.fn((name: string) => {
    if (name === "authorization") return authHeader;
    return null;
  }),
  connection: {
    remoteAddress: "::testing",
  },
  cookie: jest.fn().mockReturnValue({
    authorization: "bearer iamacookie",
  }),
  session: { data: sessionData },
});

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
