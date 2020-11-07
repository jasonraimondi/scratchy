import { MyContext } from "~/lib/graphql/my_context";

// export interface IMockContext {
//   res?: Partial<Express.Request>;
//   req?: Partial<Express.Request>;
//   auth?: any;
// }

export const mockContext = (context?: Partial<MyContext>): MyContext => ({
  ...context,
  ipAddr: "::testing",
  res: context?.res ?? mockResponse(),
  req: context?.req ?? mockRequest(),
});

export const mockRequest = ({ user, authHeader, sessionData = {}, query, body, cookies = {} }: any = {}): any => {
  return {
    csrfToken: jest.fn(() => "sample-csrf-token"),
    get: jest.fn((name: string) => {
      if (name === "authorization") return authHeader;
      return null;
    }),
    connection: {
      remoteAddress: "::testing",
    },
    cookie: {
      ...cookies,
      authorization: "bearer iamacookie",
    },
    session: { data: sessionData },
    user,
    query,
    body,
  };
};

export const mockResponse = () => {
  const res: any = {
    cookies: {},
    status: undefined,
    redirect: undefined,
  };

  res.cookie = jest.fn().mockImplementation((key, value) => {
    res.cookies[key] = value;
  });

  res.status = jest.fn().mockImplementation((status) => {
    res.status = status;
  });

  res.json = jest.fn().mockReturnValue(res);

  res.redirect = jest.fn().mockImplementation((location) => {
    res.redirect = location;
  });

  return res;
};
