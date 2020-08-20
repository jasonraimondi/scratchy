import "reflect-metadata";

import { createPool, sql } from "slonik";

const pool = createPool("postgres://scratchy:secret@localhost:30532/scratchy");

const main = () => {
  return pool.connect(async (connection) => {
    await connection.query(sql`DROP TABLE IF EXISTS users`);
    await connection.query(sql`CREATE TABLE users (id INT, name TEXT, email TEXT)`);
    await connection.query(sql`INSERT INTO users (id, name, email) values (1, 'jason', 'jason@raimondi.us')`)
    const res = await connection.query(sql`SELECT * FROM users`)
    return res.rows;
  });
};

main().then(console.log);