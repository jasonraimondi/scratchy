import faker from "faker";

import { ICreateUser, User } from "~/entities/user.entity";

export const generateUser = async (u?: Partial<ICreateUser>, isEmailConfirmed = true): Promise<User> => {
  const user = await User.create({
    email: faker.internet.exampleEmail(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: "testing123",
    ...u,
  });
  user.isEmailConfirmed = isEmailConfirmed;
  return user;
};
