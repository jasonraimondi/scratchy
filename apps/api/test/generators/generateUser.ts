import { randEmail, randFirstName } from "@ngneat/falso";

import { ICreateUser, User } from "~/entities/user.entity";

export const generateUser = async (u?: Partial<ICreateUser>, isEmailConfirmed = true): Promise<User> => {
  const user = await User.create({
    email: randEmail(),
    nickname: randFirstName(),
    password: "testing123",
    createdIP: "127.0.0.2",
    ...u,
  });
  user.isEmailConfirmed = isEmailConfirmed;
  return user;
};
