import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Role from '../../app/models/role.js';
import Ability from '../../app/models/ability.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Role.query().first();
    if (hasRecords) {
      return;
    }

    const sellerAbilitiesKeys = [
      'product:show',
      'product:index',
      'customer:show',
      'customer:index',
      'customer:create',
      'customer:update',
      'presentation:show',
      'presentation:index',
      'store:show',
      'role:show',
      'ability:show',
      'voucher:show',
      'voucher:index',
      'voucher:create',
    ];

    const admin = await Role.create({ name: 'ADMINISTRADOR' });
    const seller = await Role.create({ name: 'VENDEDOR' });
    const manager = await Role.create({ name: 'GERENTE' });
    //await Role.createMany([{ name: 'GERENTE' }, { name: 'VENDEDOR' }]);

    let abilities = await Ability.all();
    const abilityMap = Object.fromEntries(abilities.map((a) => [a.key, a]));

    await admin.related('abilities').attach([abilityMap['sys:admin'].id]);

    abilities = await Ability.query().whereIn('key', sellerAbilitiesKeys);
    const sellerAbilitiesIds = abilities.map((a) => a.id);

    await seller.related('abilities').attach(sellerAbilitiesIds);
    //TODO: Default manager abilities
    await manager.related('abilities').attach([abilityMap['sys:admin'].id]);
  }
}
