import faker from "faker";

import { ICreateUser, User } from "~/entity/user/user.entity";

export const userGenerator = async (createUser?: Partial<ICreateUser>): Promise<User> => {
  return await User.create({
    email: faker.internet.exampleEmail(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: "testing123",
    ...createUser,
  });
};
