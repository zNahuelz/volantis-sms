import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Ability from '../../app/models/ability.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Ability.query().first();
    if (hasRecords) {
      return;
    }
    await Ability.createMany([
      {
        name: 'Permisos administrativos.',
        key: 'sys:admin',
        description: 'Permite el uso de todas las funciones del sistema.',
      },
      //Abilities: Ability.
      {
        name: 'Creación de permisos.',
        key: 'ability:create',
        description: 'Permite registrar permisos para roles.',
      },
      {
        name: 'Visualizar permiso.',
        key: 'ability:show',
        description: 'Permite visualizar permisos por ID o clave.',
      },

      {
        name: 'Visualizar listado de permisos.',
        key: 'ability:index',
        description: 'Permite visualizar el listado de permisos.',
      },
      {
        name: 'Actualizar permiso.',
        key: 'ability:update',
        description: 'Permite actualizar un permiso por ID o clave.',
      },
      {
        name: 'Eliminar permiso.',
        key: 'ability:destroy',
        description: 'Permite eliminar permanentemente un permiso.',
      },
      //Abilities: Customer
      {
        name: 'Creación de clientes.',
        key: 'customer:create',
        description: 'Permite registrar clientes.',
      },
      {
        name: 'Visualizar cliente.',
        key: 'customer:show',
        description: 'Permite visualizar clientes por ID o clave.',
      },
      {
        name: 'Visualizar listado de clientes.',
        key: 'customer:index',
        description: 'Permite visualizar el listado de clientes.',
      },
      {
        name: 'Actualizar cliente.',
        key: 'customer:update',
        description: 'Permite actualizar un cliente por ID.',
      },
      {
        name: 'Eliminar y restaurar cliente.',
        key: 'customer:destroy',
        description: 'Permite eliminar permanentemente un permiso.',
      },
      //Abilities: Presentation.
      {
        name: 'Creación de presentaciones.',
        key: 'presentation:create',
        description: 'Permite registrar presentaciones.',
      },
      {
        name: 'Visualizar presentación.',
        key: 'presentation:show',
        description: 'Permite visualizar presentaciones por ID o clave.',
      },

      {
        name: 'Visualizar listado de presentaciones.',
        key: 'presentation:index',
        description: 'Permite visualizar el listado de presentaciones.',
      },
      {
        name: 'Actualizar presentación.',
        key: 'presentation:update',
        description: 'Permite actualizar un presentación por ID.',
      },
      {
        name: 'Eliminar y restaurar presentación.',
        key: 'presentation:destroy',
        description: 'Permite eliminar permanentemente un permiso.',
      },
      //Abilities: Product.
      {
        name: 'Creación de productos.',
        key: 'product:create',
        description: 'Permite registrar productos.',
      },
      {
        name: 'Visualizar producto.',
        key: 'product:show',
        description: 'Permite visualizar productos por ID o clave.',
      },
      {
        name: 'Visualizar listado de productos.',
        key: 'product:index',
        description: 'Permite visualizar el listado de productos.',
      },
      {
        name: 'Actualizar producto.',
        key: 'product:update',
        description: 'Permite actualizar un producto por ID.',
      },
      {
        name: 'Eliminar y restaurar producto.',
        key: 'product:destroy',
        description: 'Permite eliminar permanentemente un permiso.',
      },
      //Abilities: Role.
      {
        name: 'Creación de roles.',
        key: 'role:create',
        description: 'Permite registrar roles.',
      },
      {
        name: 'Visualizar rol.',
        key: 'role:show',
        description: 'Permite visualizar roles por ID o clave.',
      },
      {
        name: 'Visualizar listado de roles.',
        key: 'role:index',
        description: 'Permite visualizar el listado de roles.',
      },
      {
        name: 'Actualizar rol.',
        key: 'role:update',
        description: 'Permite actualizar un rol por ID.',
      },
      {
        name: 'Eliminar y restaurar rol.',
        key: 'role:destroy',
        description: 'Permite eliminar permanentemente un permiso.',
      },
      //Abilities: Setting.
      {
        name: 'Creación de variables de configuración.',
        key: 'setting:create',
        description: 'Permite registrar variables de configuración.',
      },
      {
        name: 'Visualizar variable de configuración.',
        key: 'setting:show',
        description: 'Permite visualizar variables de configuración por ID o clave.',
      },
      {
        name: 'Visualizar listado de variables de configuración.',
        key: 'setting:index',
        description: 'Permite visualizar el listado de variables de configuración.',
      },

      {
        name: 'Actualizar variable de configuración.',
        key: 'setting:update',
        description: 'Permite actualizar un variable de configuración por ID.',
      },
      {
        name: 'Eliminar y restaurar variable de configuración.',
        key: 'setting:destroy',
        description: 'Permite eliminar permanentemente un permiso.',
      },
      //Abilities: Store.
      {
        name: 'Creación de tiendas.',
        key: 'store:create',
        description: 'Permite registrar tiendas.',
      },

      {
        name: 'Visualizar tienda.',
        key: 'store:show',
        description: 'Permite visualizar tiendas por ID o clave.',
      },
      {
        name: 'Visualizar listado de tiendas.',
        key: 'store:index',
        description: 'Permite visualizar el listado de tiendas.',
      },
      {
        name: 'Actualizar tienda.',
        key: 'store:update',
        description: 'Permite actualizar un tienda por ID.',
      },
      {
        name: 'Eliminar y restaurar tienda.',
        key: 'store:destroy',
        description: 'Permite eliminar permanentemente un permiso.',
      },
      //Abilities: Supplier.
      {
        name: 'Creación de proveedores.',
        key: 'supplier:create',
        description: 'Permite registrar proveedores.',
      },
      {
        name: 'Visualizar proveedor.',
        key: 'supplier:show',
        description: 'Permite visualizar proveedores por ID o clave.',
      },

      {
        name: 'Visualizar listado de proveedores.',
        key: 'supplier:index',
        description: 'Permite visualizar el listado de proveedores.',
      },
      {
        name: 'Actualizar proveedor.',
        key: 'supplier:update',
        description: 'Permite actualizar un proveedor por ID.',
      },
      {
        name: 'Eliminar y restaurar proveedor.',
        key: 'supplier:destroy',
        description: 'Permite eliminar permanentemente un permiso.',
      },
      //Abilities: User.
      {
        name: 'Creación de usuarios.',
        key: 'user:create',
        description: 'Permite registrar usuarios.',
      },

      {
        name: 'Visualizar usuario.',
        key: 'user:show',
        description: 'Permite visualizar usuarios por ID o clave.',
      },
      {
        name: 'Visualizar listado de usuarios.',
        key: 'user:index',
        description: 'Permite visualizar el listado de usuarios.',
      },

      {
        name: 'Actualizar usuario.',
        key: 'user:update',
        description: 'Permite actualizar un usuario por ID.',
      },
      {
        name: 'Eliminar y restaurar usuario.',
        key: 'user:destroy',
        description: 'Permite eliminar permanentemente un permiso.',
      },
    ]);
  }
}
