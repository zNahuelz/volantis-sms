import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'buy_orders';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('status', 20).notNullable();
      table.decimal('igv', 18, 2).notNullable();
      table.decimal('subtotal', 18, 2).notNullable();
      table.decimal('total', 18, 2).notNullable();
      table.integer('store_id').unsigned().references('id').inTable('stores').notNullable();
      table.integer('supplier_id').unsigned().references('id').inTable('suppliers').notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
