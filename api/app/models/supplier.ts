import { DateTime } from 'luxon';
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import BuyOrder from './buy_order.js';
import type { HasMany } from '@adonisjs/lucid/types/relations';

export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare ruc: string;

  @column()
  declare phone: string;

  @column()
  declare email: string;

  @column()
  declare address: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @hasMany(() => BuyOrder)
  declare buyOrders: HasMany<typeof BuyOrder>;
}
