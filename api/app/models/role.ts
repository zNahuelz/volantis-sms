import { DateTime } from 'luxon';
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm';
import User from './user.js';
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations';
import Ability from './ability.js';

export default class Role extends BaseModel {
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

  @hasMany(() => User)
  declare users: HasMany<typeof User>;

  @manyToMany(() => Ability, {
    pivotTable: 'role_abilities',
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'ability_id',
  })
  declare abilities: ManyToMany<typeof Ability>;
}
