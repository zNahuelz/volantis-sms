import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import Store from './store.js';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import Customer from './customer.js';
import PaymentType from './payment_type.js';
import VoucherType from './voucher_type.js';
import SaleDetail from './sale_detail.js';
import User from './user.js';

export default class Sale extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare change: number;

  @column()
  declare cashReceived: number;

  @column()
  declare igv: number;

  @column()
  declare subtotal: number;

  @column()
  declare total: number;

  @column({ columnName: '_set' })
  declare set: string;

  @column()
  declare correlative: string;

  @column()
  declare paymentHash: string | null;

  @column()
  declare storeId: number;

  @column()
  declare customerId: number;

  @column()
  declare voucherTypeId: number;

  @column()
  declare paymentTypeId: number;

  @column()
  declare userId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @belongsTo(() => Store)
  declare store: BelongsTo<typeof Store>;

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>;

  @belongsTo(() => PaymentType)
  declare paymentType: BelongsTo<typeof PaymentType>;

  @belongsTo(() => VoucherType)
  declare voucherType: BelongsTo<typeof VoucherType>;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @hasMany(() => SaleDetail)
  declare saleDetails: HasMany<typeof SaleDetail>;
}
