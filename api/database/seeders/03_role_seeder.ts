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
      // ===== Products & stock =====
      'product:show',
      'product:index',
      'storeProduct:show',
      'storeProduct:index',
      // ===== Customers =====
      'customer:show',
      'customer:index',
      'customer:store',
      'customer:update',
      // ===== Presentations =====
      'presentation:show',
      'presentation:index',
      // ===== Sales =====
      'sale:store',
      'sale:show',
      'sale:index',
      // ===== Vouchers =====
      'voucherType:show',
      'voucherType:index',
      'voucherSerie:show',
      // ===== Payments =====
      'paymentType:show',
      'paymentType:index',
      // ===== Store context =====
      'store:list',
      'store:index',
      // ===== Reports (seller-safe) =====
      'report:salePdf',
    ];

    const managerAbilitiesKeys = [
      ...sellerAbilitiesKeys,
      // ===== Products & stock =====
      'product:store',
      'product:update',
      'product:destroy',
      'storeProduct:store',
      'storeProduct:update',
      'storeProduct:destroy',
      // ===== Presentations =====
      'presentation:store',
      'presentation:list',
      'presentation:update',
      'presentation:destroy',
      // ===== Suppliers =====
      'supplier:show',
      'supplier:index',
      'supplier:store',
      'supplier:update',
      // ===== Buy Orders =====
      'buyOrder:show',
      'buyOrder:index',
      'buyOrder:store',
      'buyOrder:update',
      // ===== Voucher Series =====
      'voucherSerie:store',
      'voucherSerie:update',
      'voucherSerie:index',
      // ===== Reports =====
      'report:sales',
      // ===== About =====
      'sys:info',
    ];

    const admin = await Role.create({ name: 'ADMINISTRADOR' });
    const seller = await Role.create({ name: 'VENDEDOR' });
    const manager = await Role.create({ name: 'GERENTE' });

    let abilities = await Ability.all();
    const abilityMap = Object.fromEntries(abilities.map((a) => [a.key, a]));

    await admin.related('abilities').attach([abilityMap['sys:admin'].id]);

    abilities = await Ability.query().whereIn('key', sellerAbilitiesKeys);
    const sellerAbilitiesIds = abilities.map((a) => a.id);
    await seller.related('abilities').attach(sellerAbilitiesIds);

    abilities = await Ability.query().whereIn('key', managerAbilitiesKeys);
    const managerAbilitiesIds = abilities.map((a) => a.id);
    await manager.related('abilities').attach(managerAbilitiesIds);
  }
}
