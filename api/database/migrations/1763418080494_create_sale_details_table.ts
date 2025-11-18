import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'sale_details';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('sale_id').unsigned().references('id').inTable('sales').notNullable();
      table.integer('product_id').unsigned().references('id').inTable('products').notNullable();
      table.integer('quantity').notNullable();
      table.decimal('unit_price', 18, 2).notNullable();

      table.primary(['sale_id', 'product_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
