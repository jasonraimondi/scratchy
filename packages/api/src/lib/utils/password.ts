import { compare, hash } from "bcryptjs";

export function verifyPassword(attempt: string, hashedPassword: string): Promise<boolean> {
  return compare(attempt, hashedPassword);
}

export function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}
