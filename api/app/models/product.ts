import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import BuyOrderDetail from './buy_order_detail.js';
import Presentation from './presentation.js';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import StoreProduct from './store_product.js';
import SaleDetail from './sale_detail.js';

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare barcode: string;

  @column()
  declare description: string;

  @column()
  declare presentationId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @belongsTo(() => Presentation)
  declare presentation: BelongsTo<typeof Presentation>;

  @hasMany(() => BuyOrderDetail)
  declare buyOrderDetails: HasMany<typeof BuyOrderDetail>;

  @hasMany(() => StoreProduct)
  declare storeProducts: HasMany<typeof StoreProduct>;

  @hasMany(() => SaleDetail)
  declare saleDetails: HasMany<typeof SaleDetail>;
}
