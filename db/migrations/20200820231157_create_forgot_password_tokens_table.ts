import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("forgot_password_tokens", (t) => {
    t.uuid("token").notNullable().primary();
    t.uuid("userId").notNullable();
    t.foreign("userId").references("users.id");
    t.dateTime("expiresAt").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("forgot_password_tokens");
}
