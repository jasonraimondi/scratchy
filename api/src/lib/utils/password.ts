import { compare, hash } from "bcryptjs";

import { ENV } from "~/config/environments";

export function checkPassword(attempt: string, hashedPassword: string): Promise<boolean> {
  return compare(attempt + ENV.salt, hashedPassword);
}

export function setPassword(password: string): Promise<string> {
  return hash(password + ENV.salt, 12);
}
