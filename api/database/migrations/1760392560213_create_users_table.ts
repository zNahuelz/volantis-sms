import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable();
      table.string('names', 30).notNullable();
      table.string('surnames', 30).notNullable();
      table.string('dni', 15).notNullable().unique();
      table.string('username', 20).notNullable().unique();
      table.string('email', 50).notNullable().unique();
      table.string('password').notNullable();
      table.string('profile_picture').nullable();
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('SET NULL');
      table.integer('store_id').unsigned().references('id').inTable('stores').notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
