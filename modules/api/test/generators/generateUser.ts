import faker from "faker";

import { ICreateUser, User } from "~/entities/user.entity";

export const generateUser = async (u?: Partial<ICreateUser>, isEmailConfirmed = true): Promise<User> => {
  const user = await User.create({
    email: faker.internet.exampleEmail(),
    nickname: faker.name.firstName(),
    password: "testing123",
    createdIP: "127.0.0.2",
    ...u,
  });
  user.isEmailConfirmed = isEmailConfirmed;
  return user;
};
