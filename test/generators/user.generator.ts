import faker from "faker";

import { ICreateUser, User } from "../../src/entity/user/user_entity";

export const userGenerator = async (createUser?: Partial<ICreateUser>): Promise<User> => {
  return await User.create({
    email: faker.internet.exampleEmail(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: "testing123",
    ...createUser,
  });
}
