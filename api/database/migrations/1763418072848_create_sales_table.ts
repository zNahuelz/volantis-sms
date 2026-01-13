import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'sales';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.decimal('change', 18, 2).notNullable();
      table.decimal('cash_received', 18, 2).notNullable();
      table.decimal('igv', 18, 2).notNullable();
      table.decimal('subtotal', 18, 2).notNullable();
      table.decimal('total', 18, 2).notNullable();
      table.string('_set', 50).notNullable();
      table.string('correlative', 50).notNullable();
      table.text('payment_hash').nullable();
      table.integer('store_id').unsigned().references('id').inTable('stores').notNullable();
      table.integer('customer_id').unsigned().references('id').inTable('customers').notNullable();
      table
        .integer('voucher_type_id')
        .unsigned()
        .references('id')
        .inTable('voucher_types')
        .notNullable();
      table
        .integer('payment_type_id')
        .unsigned()
        .references('id')
        .inTable('payment_types')
        .notNullable();
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
