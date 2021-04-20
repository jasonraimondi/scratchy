import faker from "faker";

import { ICreateUser, User } from "~/entities/user.entity";
import { ForgotPasswordToken } from "~/entities/forgot_password.entity";
import { ForgotPasswordToken as ForgotPasswordTokenModel } from "@prisma/client";
import { v4 } from "uuid";

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
