import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'buy_order_details';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('buy_order_id').unsigned().references('id').inTable('buy_orders').notNullable();
      table.integer('product_id').unsigned().references('id').inTable('products').notNullable();
      table.integer('quantity').notNullable();
      table.decimal('unit_cost', 18, 2).notNullable();

      table.primary(['buy_order_id', 'product_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
