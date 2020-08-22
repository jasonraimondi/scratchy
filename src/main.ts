import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "~/app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();

// import { pool } from "~/database";
// import { UserRepository } from "~/lib/repository/user_repository";
// import { User } from "~/entities/user";
//
// const main = () => {
//   return pool.connect(async (connection) => {
//     const user = await User.create({
//       email: `jason+${Math.floor(Math.random() * 60 + 1)}@raimondi.us`,
//     });
//     console.log(Object.keys(user));
//     const userRepository = new UserRepository(connection);
//     await userRepositfory.create(user);
//
//     // const expires_at = new Date();
//     // expires_at.setDate(expires_at.getDate() + 10);
//
//     // await connection.query(
//     //   sql`INSERT INTO users (id, "firstName", email) values (${user_id}, 'jason', ${"jason@raimondi.us"})`,
//     // );
//     // await connection.query(
//     //   sql`INSERT INTO email_confirmation_tokens (token, "userId", "expiresAt") values (${v4()}, ${user_id}, ${dateParam(
//     //     expires_at,
//     //   )})`,
//     // );
//
//     // console.log((await connection.query(sql`SELECT * FROM users`)).rows);
//     return;
//   });
// };
//
// main().then(console.log);
