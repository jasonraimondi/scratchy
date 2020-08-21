import "reflect-metadata";

import * as knex from "knex";

const Users = () => knex('users')

console.log(Users().select("id").toSQL())

// import { v4 } from "uuid";
//
// import { createPool, sql } from "slonik";
//

// const pool = createPool("postgres://scratchy:secret@localhost:30532/scratchy");
//
// const uuid = v4();

// const main = () => {
//   return pool.connect(async (connection) => {
//
//     await connection.query(sql`DROP TABLE IF EXISTS users`);
//     await connection.query(sql`
//         CREATE TABLE users
//         (
//             id    UUID NOT NULL,
//             name  TEXT NOT NULL,
//             email TEXT NOT NULL
//         )`);
//     await connection.query(sql`INSERT INTO users (id, name, email) values (${uuid}, 'jason', 'jason@raimondi.us')`);
//
//     const res = await connection.query(sql`SELECT *
//                                            FROM users`);
//     return res.rows;
//   });
// };
//
// main().then(console.log);
