import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import Role from './role.js';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import Store from './store.js';
import Sale from './sale.js';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password',
});

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare names: string;

  @column()
  declare surnames: string;

  @column()
  declare dni: string;

  @column()
  declare username: string;

  @column()
  declare email: string;

  @column({ serializeAs: null })
  declare password: string;

  @column()
  declare profilePicture: string | null;

  @column()
  declare roleId: number;

  @column()
  declare storeId: number;

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>;

  @belongsTo(() => Store)
  declare store: BelongsTo<typeof Store>;

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  static accessTokens = DbAccessTokensProvider.forModel(User);
}
