import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'settings';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('key').notNullable().unique();
      table.string('value').notNullable();
      table.string('value_type').notNullable();
      table.string('description').defaultTo('-----');
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
