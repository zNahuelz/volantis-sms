import type { HttpContext } from '@adonisjs/core/http';
import Supplier from '../models/supplier.js';
import { CreateSupplierValidator } from '../validators/supplier/create_supplier.js';
import db from '@adonisjs/lucid/services/db';
import { UpdateSupplierValidator } from '../validators/supplier/update_supplier.js';
import { DateTime } from 'luxon';

export default class SupplierController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateSupplierValidator);

    try {
      const supplier = await db.transaction(async (trx) => {
        const newSupplier = await Supplier.create(
          {
            name: data.name.trim().toUpperCase(),
            ruc: data.ruc.trim(),
            phone: data.phone.trim(),
            email: data.email.trim().toUpperCase(),
            address: data.address.trim().toUpperCase(),
          },
          { client: trx }
        );

        return newSupplier;
      });

      return response.created({
        message: 'Proveedor registrado correctamente',
        supplier,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de proveedor, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');

    const supplier = await Supplier.find(id);

    if (!supplier) {
      return response.notFound({
        message: 'Proveedor no encontrado',
      });
    }

    return response.ok(supplier);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'ruc' | 'name' | 'all'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'updatedAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = Supplier.query();

      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'ruc':
              q.whereILike('ruc', `%${search}%`);
              break;
            case 'name':
              q.whereILike('name', `%${search}%`);
              break;
            case 'all':
            default:
              q.whereILike('name', `%${search}%`)
                .orWhereILike('ruc', `%${search}%`)
                .orWhereILike('email', `%${search}%`)
                .orWhereILike('phone', `%${search}%`)
                .orWhereILike('address', `%${search}%`);
              break;
          }
        });
      }

      switch (status) {
        case 'deleted':
          query.whereNotNull('deleted_at');
          break;
        case 'available':
          query.whereNull('deleted_at');
          break;
        case 'all':
          break;
      }

      const suppliers = await query.orderBy(orderBy, orderDir).paginate(page, limit);

      suppliers.baseUrl(request.url());
      return response.ok(suppliers);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de proveedores, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async list({ request, response }: HttpContext) {
    const status = request.input('status', 'available'); //available | all
    const suppliersQuery = Supplier.query().orderBy('name', 'asc');

    switch (status) {
      case 'available':
        suppliersQuery.whereNull('deleted_at');
        break;
      case 'all':
        break;
      default:
        break;
    }

    const suppliers = await suppliersQuery;
    return response.ok(suppliers);
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateSupplierValidator, {
        meta: { supplierId: id },
      });

      const supplier = await db.transaction(async (trx) => {
        const model = await Supplier.find(id, { client: trx });

        if (!model) {
          throw new Error('SUPPLIER_NOT_FOUND');
        }

        model.merge({
          name: data.name.trim().toUpperCase(),
          ruc: data.ruc.trim(),
          phone: data.phone.trim(),
          email: data.email.trim().toUpperCase(),
          address: data.address.trim().toUpperCase(),
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: 'Proveedor actualizado correctamente',
        supplier,
      });
    } catch (error) {
      if (error.message === 'SUPPLIER_NOT_FOUND') {
        return response.notFound({
          message: `Proveedor de ID: ${id} no encontrado, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización del proveedor. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');
    const supplier = await Supplier.find(id);

    if (!supplier) {
      return response.notFound({ message: `Proveedor de ID: ${id} no encontrado.` });
    }

    await supplier.merge({ deletedAt: supplier.deletedAt != null ? null : DateTime.utc() }).save();

    return response.ok({
      message: `Visibilidad de provedor de ID: ${id} actualizada correctamente.`,
      supplier,
    });
  }
}
