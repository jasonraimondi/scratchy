import faker from "faker";

import { ICreateUser, User } from "~/app/user/entities/user.entity";

export const userGenerator = async (createUser?: Partial<ICreateUser>, isEmailConfirmed = true): Promise<User> => {
  const user = await User.create({
    email: faker.internet.exampleEmail(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: "testing123",
    ...createUser,
  });
  user.isEmailConfirmed = isEmailConfirmed;
  return user;
};
