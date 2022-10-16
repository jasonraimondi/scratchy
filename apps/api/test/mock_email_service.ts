import { ISendMailOptions } from "@nestjs-modules/mailer";

import { vi, beforeEach } from "vitest";

let emails: ISendMailOptions[] = [];

export const emailServiceMock: any = {
  send: vi.fn().mockImplementation(res => {
    emails.push(res);
  }),
};

beforeEach(() => {
  emails = [];
});

export { emails };
