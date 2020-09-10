import { MyContext } from "~/config/my_context";

// export interface IMockContext {
//   res?: Partial<Express.Request>;
//   req?: Partial<Express.Request>;
//   auth?: any;
// }

export const mockContext = (context?: Partial<MyContext>): MyContext => ({
  ...context,
  res: context?.res ?? mockResponse(),
  req: context?.req ?? mockRequest(),
});

export const mockRequest = ({ user, authHeader, sessionData = {}}: any = {}): any => ({
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
  user
});

export const mockResponse = () => {
  const res: any = {
    cookies: [],
  };
  res.cookie = jest.fn().mockImplementation((key, value) => {
    res.cookies.push([key, value]);
  });
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
