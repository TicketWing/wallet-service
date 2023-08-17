import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(function () {
      return knex.schema.createTable("transactions", function (table) {
        table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        table.string("user_id").notNullable().unique();
        table.string("amount").notNullable();
        table.string("currency").notNullable();
        table.string("description").notNullable();
        table.string("status").notNullable().defaultTo("pending");
        table.timestamp("date").defaultTo(knex.fn.now());
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("transactions");
}
