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
      dni: '00000123',
      username: 'admin',
      email: 'admin@site.com',
      password: 'admin',
      roleId: adminRole.id,
      profilePicture: 'admin_default_pfp.png',
      storeId: 1,
    });

    await User.create({
      names: 'Gerente',
      surnames: '------',
      dni: '00000234',
      username: 'manager',
      email: 'manager@volantis.com',
      password: 'manager',
      roleId: managerRole.id,
      profilePicture: 'manager_default_pfp.png',
      storeId: 1,
    });

    await User.create({
      names: 'Vendedor',
      surnames: '------',
      dni: '00000567',
      username: 'seller0',
      email: 'seller@volantis.com',
      password: 'seller0',
      roleId: sellerRole.id,
      profilePicture: 'seller_default_pfp.png',
      storeId: 1,
    });
  }
}
