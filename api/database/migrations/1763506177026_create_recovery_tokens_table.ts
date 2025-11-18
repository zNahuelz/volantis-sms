import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'recovery_tokens';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('email', 50).notNullable();
      table.string('token').notNullable().unique();
      table.timestamp('expiration', { useTz: true }).notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
