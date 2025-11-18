import { DateTime } from 'luxon';
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import Sale from './sale.js';
import type { HasMany } from '@adonisjs/lucid/types/relations';

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare names: string;

  @column()
  declare surnames: string;

  @column()
  declare address: string | null;

  @column()
  declare phone: string;

  @column()
  declare email: string;

  @column()
  declare dni: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>;
}
