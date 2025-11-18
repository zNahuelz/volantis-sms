import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Role from '../../app/models/role.js';
import User from '../../app/models/user.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await User.query().first();
    if (hasRecords) {
      return;
    }
    const adminRole = await Role.findBy('name', 'ADMINISTRADOR');
    const managerRole = await Role.findBy('name', 'GERENTE');
    const sellerRole = await Role.findBy('name', 'VENDEDOR');

    if (!adminRole || !managerRole || !sellerRole) {
      console.warn('Rol no encontrado. Ejecute el seeder de roles primero.');
      return;
    }

    await User.create({
      names: 'Administrador',
      surnames: '------',
      username: 'admin',
      email: 'admin@site.com',
      password: 'admin',
      roleId: adminRole.id,
      storeId: 1,
    });

    await User.create({
      names: 'Gerente',
      surnames: '------',
      username: 'manager',
      email: 'manager@volantis.com',
      password: 'manager',
      roleId: managerRole.id,
      storeId: 1,
    });

    await User.create({
      names: 'Vendedor',
      surnames: '------',
      username: 'seller0',
      email: 'seller@volantis.com',
      password: 'seller0',
      roleId: sellerRole.id,
      storeId: 1,
    });
  }
}
