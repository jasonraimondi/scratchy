import faker from "faker";

import { ICreateUser, User, createUser } from "~/app/user/entities/user.entity";

export const userGenerator = async (u?: Partial<ICreateUser>, isEmailConfirmed = true): Promise<User> => {
  const user = await createUser({
    email: faker.internet.exampleEmail(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: "testing123",
    ...u,
  });
  user.isEmailConfirmed = isEmailConfirmed;
  return user;
};
