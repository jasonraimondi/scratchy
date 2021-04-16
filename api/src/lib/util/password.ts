import { compare, hash } from "bcryptjs";
import crypto from "crypto";

import { ENV } from "~/config/environments";

const sha256 = () => crypto.createHmac("sha256", ENV.secrets.salt);

export function checkPassword(attempt: string, hashedPassword: string): Promise<boolean> {
  attempt = sha256().update(attempt).digest("hex");
  return compare(attempt, hashedPassword);
}

export async function setPassword(password: string): Promise<string> {
  password = sha256().update(password).digest("hex");
  return hash(password, 10);
}
