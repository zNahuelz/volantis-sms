import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import Store from './store.js';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import Supplier from './supplier.js';
import BuyOrderDetail from './buy_order_detail.js';

export default class BuyOrder extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare status: string;

  @column()
  declare igv: number;

  @column()
  declare subtotal: number;

  @column()
  declare total: number;

  @column()
  declare storeId: number;

  @column()
  declare supplierId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @belongsTo(() => Store)
  declare store: BelongsTo<typeof Store>;

  @belongsTo(() => Supplier)
  declare supplier: BelongsTo<typeof Supplier>;

  @hasMany(() => BuyOrderDetail)
  declare buyOrderDetails: HasMany<typeof BuyOrderDetail>;
}
