import { DateTime } from 'luxon';
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import BuyOrder from './buy_order.js';
import StoreProduct from './store_product.js';
import Sale from './sale.js';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import User from './user.js';

export default class Store extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare ruc: string;

  @column()
  declare address: string;

  @column()
  declare phone: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @hasMany(() => BuyOrder)
  declare buyOrders: HasMany<typeof BuyOrder>;

  @hasMany(() => StoreProduct)
  declare storeProducts: HasMany<typeof StoreProduct>;

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>;

  @hasMany(() => User)
  declare users: HasMany<typeof User>;
}
