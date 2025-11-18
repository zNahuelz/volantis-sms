import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import VoucherType from './voucher_type.js';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import Sale from './sale.js';

export default class VoucherSerie extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare seriesCode: string;

  @column()
  declare currentNumber: number;

  @column()
  declare isActive: boolean;

  @column()
  declare voucherTypeId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @belongsTo(() => VoucherType)
  declare voucherType: BelongsTo<typeof VoucherType>;

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>;
}
