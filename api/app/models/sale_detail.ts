import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Sale from './sale.js';
import Product from './product.js';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class SaleDetail extends BaseModel {
  @column()
  declare saleId: number;

  @column()
  declare productId: number;

  @column()
  declare quantity: number;

  @column()
  declare unitPrice: number;

  @belongsTo(() => Sale)
  declare sale: BelongsTo<typeof Sale>;

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>;
}
