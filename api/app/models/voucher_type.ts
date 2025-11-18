import { DateTime } from 'luxon';
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import VoucherSerie from './voucher_serie.js';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import Sale from './sale.js';

export default class VoucherType extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @hasMany(() => VoucherSerie)
  declare voucherSeries: HasMany<typeof VoucherSerie>;

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>;
}
