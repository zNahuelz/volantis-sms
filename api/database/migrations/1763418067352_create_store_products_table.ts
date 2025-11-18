import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'store_products';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('store_id').unsigned().references('id').inTable('stores').notNullable();
      table.integer('product_id').unsigned().references('id').inTable('products').notNullable();
      table.decimal('buy_price', 18, 2).notNullable();
      table.decimal('sell_price', 18, 2).notNullable();
      table.decimal('igv', 18, 2).notNullable();
      table.decimal('profit', 18, 2).notNullable();
      table.integer('stock').notNullable();
      table.boolean('salable').notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();

      table.primary(['store_id', 'product_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
