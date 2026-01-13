import type { HttpContext } from '@adonisjs/core/http';
import { CreateVoucherTypeValidator } from '../validators/vouchers/create_voucher_type.js';
import db from '@adonisjs/lucid/services/db';
import VoucherType from '../models/voucher_type.js';
import { UpdateVoucherTypeValidator } from '../validators/vouchers/update_voucher_type.js';
import { DateTime } from 'luxon';

export default class VoucherTypeController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateVoucherTypeValidator);

    try {
      const voucherType = await db.transaction(async (trx) => {
        const newVoucherType = await VoucherType.create(
          {
            name: data.name.trim().toUpperCase(),
          },
          { client: trx }
        );

        return newVoucherType;
      });

      return response.created({
        message: 'Tipo de comprobante de pago registrado correctamente',
        voucherType,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de tipo de comprobante de pago, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');

    const voucherType = await VoucherType.find(id);

    if (!voucherType) {
      return response.notFound({
        message: 'Tipo de comprobante de pago no encontrado',
      });
    }

    await voucherType.load('voucherSeries');

    return response.ok(voucherType);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id'  | 'name' | 'all'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'updatedAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = VoucherType.query();

      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'name':
              q.whereILike('name', `%${search}%`);
              break;
            case 'all':
            default:
              q.whereILike('name', `%${search}%`);
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

      const voucherTypes = await query
        .preload('voucherSeries')
        .orderBy(orderBy, orderDir)
        .paginate(page, limit);

      voucherTypes.baseUrl(request.url());
      return response.ok(voucherTypes);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de tipos de comprobantes de pago, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async list({ request, response }: HttpContext) {
    const status = request.input('status', 'available'); //available | all
    const voucherTypesQuery = VoucherType.query().orderBy('name', 'asc');

    switch (status) {
      case 'available':
        voucherTypesQuery.whereNull('deleted_at');
        break;
      case 'all':
        break;
      default:
        break;
    }

    const voucherTypes = await voucherTypesQuery;
    return response.ok(voucherTypes);
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateVoucherTypeValidator, {
        meta: { voucherTypeId: id },
      });

      const voucherType = await db.transaction(async (trx) => {
        const model = await VoucherType.find(id, { client: trx });

        if (!model) {
          throw new Error('VOUCHER_TYPE_NOT_FOUND');
        }

        model.merge({
          name: data.name.trim().toUpperCase(),
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: 'Tipo de comprobante de pago actualizado correctamente',
        voucherType,
      });
    } catch (error) {
      if (error.message === 'VOUCHER_TYPE_NOT_FOUND') {
        return response.notFound({
          message: `Tipo de comprobante de pago de ID: ${id} no encontrado, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización del tipo de comprobante de pago. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');
    const voucherType = await VoucherType.find(id);

    if (!voucherType) {
      return response.notFound({
        message: `Tipo de comprobante de pago de ID: ${id} no encontrado.`,
      });
    }

    const voucherTypes = await VoucherType.query().whereNull('deleted_at');
    const isDestroy = voucherType.deletedAt == null ? true : false;

    if (voucherTypes.length <= 1 && isDestroy) {
      return response.badRequest({
        message:
          'El sistema requiere al menos un tipo de comprobante de pago habilitado para funcionar correctamente. Operación cancelada.',
      });
    }

    await voucherType
      .merge({ deletedAt: voucherType.deletedAt != null ? null : DateTime.utc() })
      .save();

    return response.ok({
      message: `Visibilidad de tipo de comprobante de pago de ID: ${id} actualizada correctamente.`,
      voucherType,
    });
  }

  public async regenerateTypes({ response }: HttpContext) {
    const hasRecords = await VoucherType.query().first();
    if (hasRecords) {
      return response.badRequest({
        message:
          'El sistema cuenta con tipos de comprobantes de pago registrados, operación cancelada. Comuniquese con administración si presenta problemas.',
      });
    }

    VoucherType.createMany([{ name: 'BOLETA' }, { name: 'FACTURA' }]);
    return response.ok({
      message:
        'Tipos de comprobantes de pago por defecto generados correctamente. Debe configurar una serie por defecto para cada uno en el módulo de gestión de series de comp. de pago. Comuniquese con administración si presenta problemas.',
    });
  }
}
