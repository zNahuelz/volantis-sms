import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Store from './store.js';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Product from './product.js';

export default class StoreProduct extends BaseModel {
  @column()
  declare storeId: number;

  @column()
  declare productId: number;

  @column()
  declare buyPrice: number;

  @column()
  declare sellPrice: number;

  @column()
  declare igv: number;

  @column()
  declare profit: number;

  @column()
  declare stock: number;

  @column()
  declare salable: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @belongsTo(() => Store)
  declare store: BelongsTo<typeof Store>;

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>;
}
