import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class RecoveryToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare email: string;

  @column()
  declare token: string;

  @column.dateTime()
  declare expiration: DateTime;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
