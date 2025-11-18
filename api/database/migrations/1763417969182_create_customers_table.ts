import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'customers';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('names', 30).notNullable();
      table.string('surnames', 30).notNullable();
      table.string('address', 150).nullable();
      table.string('phone', 15).notNullable();
      table.string('email', 50).notNullable();
      table.string('dni', 15).notNullable().defaultTo('');
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
