import "dotenv/config";
import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "~/app/app.module";
import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";

const exampleUserId = "dcaecd32-00e7-4505-bf90-db917fff7c89";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get(UserRepo);

  let user: User;
  try {
    user = await userRepository.findById(exampleUserId);
  } catch (e) {
    user = await User.create({
      id: "dcaecd32-00e7-4505-bf90-db917fff7c89",
      email: "jason@raimondi.us",
      password: "jasonraimondi",
      firstName: "Jason",
      lastName: "Raimondi",
      createdIP: "127.0.0.1",
    });
    user.isEmailConfirmed = true;
    user = await userRepository.create(user);
  }

  console.log({ user });

  await app.close();
}

bootstrap();
