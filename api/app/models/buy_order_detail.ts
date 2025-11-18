import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import BuyOrder from './buy_order.js';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Product from './product.js';

export default class BuyOrderDetail extends BaseModel {
  @column()
  declare buyOrderId: number;

  @column()
  declare productId: number;

  @column()
  declare quantity: number;

  @column()
  declare unitCost: number;

  @belongsTo(() => BuyOrder)
  declare buyOrder: BelongsTo<typeof BuyOrder>;

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>;
}
