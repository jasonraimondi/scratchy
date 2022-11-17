import type { User } from "$generated/client";
import { v4 } from "uuid";
import { hashPassword, verifyPassword } from "~/lib/utils/password";

export type CreateUser = Omit<Partial<User>, "passwordHash" | "tokenVersion"> & {
  email: string;
  password?: string | null;
  createdIP: string;
};

export async function createUser({ password, ...newUser }: CreateUser): Promise<User> {
  return {
    id: v4(),
    isEmailConfirmed: false,
    roles: [],
    nickname: null,
    ...newUser,
    lastLoginAt: null,
    lastLoginIP: null,
    lastHeartbeatAt: null,
    passwordHash: password ? await hashPassword(password) : null,
    tokenVersion: 0,
    createdAt: new Date(),
    updatedAt: null,
  };
}

export async function verifyUser(user: User, password: string): Promise<void> {
  if (!user.passwordHash) {
    throw new Error("user must create password");
  }

  if (!user.isEmailConfirmed) {
    throw new Error("user is not active");
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    throw new Error("invalid password");
  }
}
