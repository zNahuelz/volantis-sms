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
      {
        name: 'Ver info. del sistema',
        key: 'sys:info',
        description: '-----',
      },
      {
        name: 'Restablecer contraseña remotamente',
        key: 'auth:remotePasswordReset',
        description: 'Restablecer contraseña remotamente (detalle de usuario)',
      },
      // ability
      { name: 'Crear permiso', key: 'ability:store', description: 'Crear permiso' },
      { name: 'Ver permiso', key: 'ability:show', description: 'Ver permiso' },
      { name: 'Listar permisos', key: 'ability:index', description: 'Listar permisos' },
      { name: 'Actualizar permiso', key: 'ability:update', description: 'Actualizar permiso' },
      { name: 'Eliminar permiso', key: 'ability:destroy', description: 'Eliminar permiso' },
      {
        name: 'Permisos para selector',
        key: 'ability:list',
        description: 'Listar permisos para selector',
      },

      // buyOrder
      {
        name: 'Crear orden de compra',
        key: 'buyOrder:store',
        description: 'Crear orden de compra',
      },
      { name: 'Ver orden de compra', key: 'buyOrder:show', description: 'Ver orden de compra' },
      {
        name: 'Listar órdenes de compra',
        key: 'buyOrder:index',
        description: 'Listar órdenes de compra',
      },
      {
        name: 'Actualizar orden de compra',
        key: 'buyOrder:update',
        description: 'Actualizar orden de compra',
      },
      {
        name: 'Eliminar orden de compra',
        key: 'buyOrder:destroy',
        description: 'Eliminar orden de compra',
      },

      // customer
      { name: 'Crear cliente', key: 'customer:store', description: 'Crear cliente' },
      { name: 'Ver cliente', key: 'customer:show', description: 'Ver cliente' },
      { name: 'Listar clientes', key: 'customer:index', description: 'Listar clientes' },
      { name: 'Actualizar cliente', key: 'customer:update', description: 'Actualizar cliente' },
      { name: 'Eliminar cliente', key: 'customer:destroy', description: 'Eliminar cliente' },
      {
        name: 'Buscar cliente por DNI',
        key: 'customer:showByDni',
        description: 'Permite buscar cliente por DNI',
      },
      {
        name: 'Actualizar cliente generico.',
        key: 'customer:updateDefault',
        description: 'Permite modificar los datos del cliente generico (DNI 0)',
      },
      {
        name: 'Eliminar cliente generico.',
        key: 'customer:destroyDefault',
        description: 'Permite cambiar la visibilidad del cliente generico (DNI 0)',
      },

      // paymentType
      { name: 'Crear tipo de pago', key: 'paymentType:store', description: 'Crear tipo de pago' },
      { name: 'Ver tipo de pago', key: 'paymentType:show', description: 'Ver tipo de pago' },
      {
        name: 'Listar tipos de pago',
        key: 'paymentType:index',
        description: 'Listar tipos de pago',
      },
      {
        name: 'Actualizar tipo de pago',
        key: 'paymentType:update',
        description: 'Actualizar tipo de pago',
      },
      {
        name: 'Eliminar tipo de pago',
        key: 'paymentType:destroy',
        description: 'Eliminar tipo de pago',
      },
      {
        name: 'Tipos de pago para selector',
        key: 'paymentType:list',
        description: 'Listar tipos de pago para selector',
      },

      // presentation
      { name: 'Crear presentación', key: 'presentation:store', description: 'Crear presentación' },
      { name: 'Ver presentación', key: 'presentation:show', description: 'Ver presentación' },
      {
        name: 'Listar presentaciones',
        key: 'presentation:index',
        description: 'Listar presentaciones',
      },
      {
        name: 'Actualizar presentación',
        key: 'presentation:update',
        description: 'Actualizar presentación',
      },
      {
        name: 'Eliminar presentación',
        key: 'presentation:destroy',
        description: 'Eliminar presentación',
      },
      {
        name: 'Presentaciones para selector',
        key: 'presentation:list',
        description: 'Listar presentaciones para selector',
      },

      // product
      { name: 'Crear producto', key: 'product:store', description: 'Crear producto' },
      { name: 'Ver producto', key: 'product:show', description: 'Ver producto' },
      { name: 'Listar productos', key: 'product:index', description: 'Listar productos' },
      { name: 'Actualizar producto', key: 'product:update', description: 'Actualizar producto' },
      { name: 'Eliminar producto', key: 'product:destroy', description: 'Eliminar producto' },
      {
        name: 'Productos para selector',
        key: 'product:list',
        description: 'Listar productos para selector',
      },
      {
        name: 'Generar código de barras aleatorio.',
        key: 'utils:generateRandomBarcode',
        description: 'Utilidad para generar códigos de barras.',
      },
      {
        name: 'Ver producto por código de barras',
        key: 'product:showByBarcode',
        description: 'Buscar producto por cod. barras',
      },

      // report
      { name: 'Reporte de ventas', key: 'report:sales', description: 'Generar reporte de ventas' },
      {
        name: 'PDF de comprobante de venta',
        key: 'report:salePdf',
        description: 'Generar PDF de venta',
      },

      // role
      { name: 'Crear rol', key: 'role:store', description: 'Crear rol' },
      { name: 'Ver rol', key: 'role:show', description: 'Ver rol' },
      { name: 'Listar roles', key: 'role:index', description: 'Listar roles' },
      { name: 'Actualizar rol', key: 'role:update', description: 'Actualizar rol' },
      { name: 'Eliminar rol', key: 'role:destroy', description: 'Eliminar rol' },
      { name: 'Roles para selector', key: 'role:list', description: 'Listar roles para selector' },

      // sale
      { name: 'Crear venta', key: 'sale:store', description: 'Registrar venta' },
      { name: 'Ver venta', key: 'sale:show', description: 'Ver venta' },
      { name: 'Listar ventas', key: 'sale:index', description: 'Listar ventas' },

      // setting
      { name: 'Crear configuración', key: 'setting:store', description: 'Crear configuración' },
      { name: 'Ver configuración', key: 'setting:show', description: 'Ver configuración' },
      {
        name: 'Listar configuraciones',
        key: 'setting:index',
        description: 'Listar configuraciones',
      },
      {
        name: 'Actualizar configuración',
        key: 'setting:update',
        description: 'Actualizar configuración',
      },
      {
        name: 'Eliminar configuración',
        key: 'setting:destroy',
        description: 'Eliminar configuración',
      },
      {
        name: 'Configuraciones para selector',
        key: 'setting:list',
        description: 'Listar configuraciones para selector',
      },
      {
        name: 'Ver configuración por clave',
        key: 'setting:showByKey',
        description: 'Buscar config. por clave.',
      },

      // storeProduct
      {
        name: 'Crear producto por tienda',
        key: 'storeProduct:store',
        description: 'Crear producto por tienda',
      },
      {
        name: 'Ver producto por tienda',
        key: 'storeProduct:show',
        description: 'Ver producto por tienda',
      },
      {
        name: 'Listar productos por tienda',
        key: 'storeProduct:index',
        description: 'Listar productos por tienda',
      },
      {
        name: 'Actualizar producto por tienda',
        key: 'storeProduct:update',
        description: 'Actualizar producto por tienda',
      },
      {
        name: 'Eliminar producto por tienda',
        key: 'storeProduct:destroy',
        description: 'Eliminar producto por tienda',
      },
      {
        name: 'Productos por tienda para selector',
        key: 'storeProduct:list',
        description: 'Listar productos por tienda para selector',
      },
      {
        name: 'Ver producto por tienda, por cod. barras',
        key: 'storeProduct:showByBarcode',
        description: 'Ver producto por cod. barras.',
      },
      {
        name: 'Ver producto por tienda, por id prod.',
        key: 'storeProduct:showByProductId',
        description: 'Ver producto por id prod.',
      },

      // store
      { name: 'Crear tienda', key: 'store:store', description: 'Crear tienda' },
      { name: 'Ver tienda', key: 'store:show', description: 'Ver tienda' },
      { name: 'Listar tiendas', key: 'store:index', description: 'Listar tiendas' },
      { name: 'Actualizar tienda', key: 'store:update', description: 'Actualizar tienda' },
      { name: 'Eliminar tienda', key: 'store:destroy', description: 'Eliminar tienda' },
      {
        name: 'Tiendas para selector',
        key: 'store:list',
        description: 'Listar tiendas para selector',
      },

      // supplier
      { name: 'Crear proveedor', key: 'supplier:store', description: 'Crear proveedor' },
      { name: 'Ver proveedor', key: 'supplier:show', description: 'Ver proveedor' },
      { name: 'Listar proveedores', key: 'supplier:index', description: 'Listar proveedores' },
      { name: 'Actualizar proveedor', key: 'supplier:update', description: 'Actualizar proveedor' },
      { name: 'Eliminar proveedor', key: 'supplier:destroy', description: 'Eliminar proveedor' },
      {
        name: 'Proveedores para selector',
        key: 'supplier:list',
        description: 'Listar proveedores para selector',
      },

      // user
      { name: 'Crear usuario', key: 'user:store', description: 'Crear usuario' },
      { name: 'Ver usuario', key: 'user:show', description: 'Ver usuario' },
      { name: 'Listar usuarios', key: 'user:index', description: 'Listar usuarios' },
      { name: 'Actualizar usuario', key: 'user:update', description: 'Actualizar usuario' },
      { name: 'Eliminar usuario', key: 'user:destroy', description: 'Eliminar usuario' },
      {
        name: 'Eliminar foto de perfil',
        key: 'user:removeProfilePicture',
        description: 'Eliminar foto de perfil',
      },

      // voucherSerie
      {
        name: 'Crear serie de comprobante',
        key: 'voucherSerie:store',
        description: 'Crear serie de comprobante',
      },
      {
        name: 'Ver serie de comprobante',
        key: 'voucherSerie:show',
        description: 'Ver serie de comprobante',
      },
      {
        name: 'Listar series de comprobante',
        key: 'voucherSerie:index',
        description: 'Listar series de comprobante',
      },
      {
        name: 'Actualizar serie de comprobante',
        key: 'voucherSerie:update',
        description: 'Actualizar serie de comprobante',
      },
      {
        name: 'Eliminar serie de comprobante',
        key: 'voucherSerie:destroy',
        description: 'Eliminar serie de comprobante',
      },

      // voucherType
      {
        name: 'Crear tipo de comprobante',
        key: 'voucherType:store',
        description: 'Crear tipo de comprobante',
      },
      {
        name: 'Ver tipo de comprobante',
        key: 'voucherType:show',
        description: 'Ver tipo de comprobante',
      },
      {
        name: 'Listar tipos de comprobante',
        key: 'voucherType:index',
        description: 'Listar tipos de comprobante',
      },
      {
        name: 'Actualizar tipo de comprobante',
        key: 'voucherType:update',
        description: 'Actualizar tipo de comprobante',
      },
      {
        name: 'Eliminar tipo de comprobante',
        key: 'voucherType:destroy',
        description: 'Eliminar tipo de comprobante',
      },
      {
        name: 'Tipos de comprobante para selector',
        key: 'voucherType:list',
        description: 'Listar tipos de comprobante para selector',
      },
      {
        name: 'Regenerar tipos de comprobantes (BOL y FACT)',
        key: 'voucherType:regenerate',
        description: 'Regenerar tipos de comprobantes de venta: Boleta y factura.',
      },
    ]);
  }
}
