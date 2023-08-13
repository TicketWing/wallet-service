import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(function () {
      return knex.schema.createTable("balances", function (table) {
        table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        table.string("user_id").notNullable().unique();
        table.string("amount").notNullable().defaultTo(0);
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("balances");
}
