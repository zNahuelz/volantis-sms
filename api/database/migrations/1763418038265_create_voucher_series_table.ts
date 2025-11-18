import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'voucher_series';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('series_code', 50).notNullable().unique();
      table.integer('current_number').notNullable();
      table.boolean('is_active').notNullable();
      table
        .integer('voucher_type_id')
        .unsigned()
        .references('id')
        .inTable('voucher_types')
        .notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
