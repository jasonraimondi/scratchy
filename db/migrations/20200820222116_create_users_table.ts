import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (t) => {
    t.uuid("id").notNullable().primary();
    t.string("email").notNullable().unique();
    t.string("name").nullable();
    t.string("password").nullable();
    t.string("firstName").nullable();
    t.string("lastName").nullable();
    t.boolean("isEmailConfirmed").notNullable().defaultTo(false);
    t.dateTime("lastLoginAt").nullable();
    t.dateTime("createdAt").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updatedAt").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users");
}
