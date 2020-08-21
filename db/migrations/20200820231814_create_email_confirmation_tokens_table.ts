import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("email_confirmation_tokens", (t) => {
    t.uuid("token").notNullable().primary();
    t.uuid("userId").notNullable();
    t.foreign("userId").references("users.id");
    t.dateTime("expiresAt").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("email_confirmation_tokens");
}
