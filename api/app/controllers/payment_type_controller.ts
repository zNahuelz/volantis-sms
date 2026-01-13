import type { HttpContext } from '@adonisjs/core/http';
import { CreatePaymentTypeValidator } from '../validators/paymentType/create_payment_type.js';
import db from '@adonisjs/lucid/services/db';
import PaymentType from '../models/payment_type.js';
import { DateTime } from 'luxon';
import { UpdatePaymentTypeValidator } from '../validators/paymentType/update_payment_type.js';

export default class PaymentTypeController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreatePaymentTypeValidator);

    try {
      const paymentType = await db.transaction(async (trx) => {
        const newPaymentType = await PaymentType.create(
          {
            name: data.name.trim().toUpperCase(),
            action: data.action.trim().toUpperCase(),
          },
          { client: trx }
        );

        return newPaymentType;
      });

      return response.created({
        message: 'Tipo de pago registrado correctamente',
        paymentType,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de tipo de pago, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');

    const paymentType = await PaymentType.find(id);

    if (!paymentType) {
      return response.notFound({
        message: 'Tipo de pago no encontrado',
      });
    }

    return response.ok(paymentType);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'name' | 'action' | 'all'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'updatedAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = PaymentType.query();

      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'name':
              q.whereILike('name', `%${search}%`);
              break;
            case 'action':
              q.where('action', search);
              break;
            case 'all':
            default:
              q.whereILike('name', `%${search}%`).orWhereILike('action', `%${search}%`);
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

      const paymentTypes = await query.orderBy(orderBy, orderDir).paginate(page, limit);

      paymentTypes.baseUrl(request.url());
      return response.ok(paymentTypes);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de tipos de pago, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async list({ request, response }: HttpContext) {
    const status = request.input('status', 'available'); //available | all
    const paymentTypesQuery = PaymentType.query().orderBy('name', 'asc');

    switch (status) {
      case 'available':
        paymentTypesQuery.whereNull('deleted_at');
        break;
      case 'all':
        break;
      default:
        break;
    }

    const paymentTypes = await paymentTypesQuery;
    return response.ok(paymentTypes);
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdatePaymentTypeValidator, {
        meta: { paymentTypeId: id },
      });

      const paymentType = await db.transaction(async (trx) => {
        const model = await PaymentType.find(id, { client: trx });

        if (!model) {
          throw new Error('PAYMENT_TYPE_NOT_FOUND');
        }

        model.merge({
          name: data.name.trim().toUpperCase(),
          action: data.action.trim().toUpperCase(),
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: 'Tipo de pago actualizado correctamente',
        paymentType,
      });
    } catch (error) {
      if (error.message === 'PAYMENT_TYPE_NOT_FOUND') {
        return response.notFound({
          message: `Tipo de pago de ID: ${id} no encontrado, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización del tipo de pago. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');
    const paymentType = await PaymentType.find(id);

    if (!paymentType) {
      return response.notFound({ message: `Tipo de pago de ID: ${id} no encontrado.` });
    }

    const paymentTypes = await PaymentType.query().whereNull('deleted_at');
    const isDestroy = paymentType.deletedAt == null ? true : false;

    if (paymentTypes.length <= 1 && isDestroy) {
      return response.badRequest({
        message:
          'El sistema requiere al menos un tipo de pago habilitado para funcionar correctamente. Operación cancelada.',
      });
    }

    await paymentType
      .merge({ deletedAt: paymentType.deletedAt != null ? null : DateTime.utc() })
      .save();

    return response.ok({
      message: `Visibilidad de tipo de pago de ID: ${id} actualizada correctamente.`,
      paymentType,
    });
  }
}
