import { ISendMailOptions } from "@nestjs-modules/mailer";

let emails: ISendMailOptions[] = [];

export const emailServiceMock: any = {
  send: jest.fn().mockImplementation(res => {
    emails.push(res);
  }),
};

beforeEach(() => {
  emails = [];
});

export { emails };
