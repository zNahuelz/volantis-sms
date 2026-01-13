import type { HttpContext } from '@adonisjs/core/http';
import { CreateVoucherSerieValidator } from '../validators/vouchers/create_voucher_serie.js';
import db from '@adonisjs/lucid/services/db';
import VoucherSerie from '../models/voucher_serie.js';
import { UpdateVoucherSerieValidator } from '../validators/vouchers/update_voucher_serie.js';

export default class VoucherSerieController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateVoucherSerieValidator);

    try {
      const voucherSerie = await db.transaction(async (trx) => {
        const newVoucherSerie = await VoucherSerie.create(
          {
            seriesCode: data.seriesCode.toUpperCase(),
            currentNumber: data.currentNumber,
            voucherTypeId: data.voucherTypeId,
            isActive: false,
          },
          { client: trx }
        );

        return newVoucherSerie;
      });

      return response.created({
        message: `Serie creada correctamente. Asignado el formato SERIE-PROX. CORRELATIVO: ${voucherSerie.seriesCode} - ${voucherSerie.currentNumber}. Recuerde habilitar la serie para su uso.`,
        voucherSerie,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de serie de comprobante de pago, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');

    const voucherSerie = await VoucherSerie.find(id);

    if (!voucherSerie) {
      return response.notFound({
        message: 'Serie de comprobante de pago no encontrada',
      });
    }

    await voucherSerie.load('voucherType');

    return response.ok(voucherSerie);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'seriesCode' | 'currentNumber' | 'all'
      const status = request.input('status', 'available'); // 'active' | 'inactive' | 'all'
      const orderBy = request.input('orderBy', 'series_code');
      const orderDir = request.input('orderDir', 'asc'); // 'asc' | 'desc'

      const query = VoucherSerie.query();

      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'seriesCode':
              q.whereILike('series_code', `%${search}%`);
              break;
            case 'currentNumber':
              q.whereILike('current_number', `%${search}%`);
              break;
            case 'all':
            default:
              q.whereILike('series_code', `%${search}%`).orWhereILike(
                'current_number',
                `%${search}%`
              );
              break;
          }
        });
      }

      switch (status) {
        case 'inactive':
          query.where('is_active', false);
          break;
        case 'active':
          query.where('is_active', true);
          break;
        case 'all':
          break;
      }

      const voucherSeries = await query
        .preload('voucherType')
        .orderBy(orderBy, orderDir)
        .paginate(page, limit);

      voucherSeries.baseUrl(request.url());
      return response.ok(voucherSeries);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de series de comprobantes de pago, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateVoucherSerieValidator);

      const voucherSerie = await db.transaction(async (trx) => {
        const model = await VoucherSerie.find(id, { client: trx });

        if (!model) {
          throw new Error('VOUCHER_SERIE_NOT_FOUND');
        }

        model.merge({
          currentNumber: data.currentNumber,
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: `Serie actualizada correctamente. Próximo correlativo asignado: ${voucherSerie.currentNumber}. Recuerde habilitar la serie de ser necesario.`,
        voucherSerie,
      });
    } catch (error) {
      if (error.message === 'VOUCHER_SERIE_NOT_FOUND') {
        return response.notFound({
          message: `Serie de comprobante de pago de ID: ${id} no encontrada, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización de la serie de comprobante de pago. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const voucherSerie = await db.transaction(async (trx) => {
        const model = await VoucherSerie.find(id, { client: trx });

        if (!model) {
          throw new Error('VOUCHER_SERIE_NOT_FOUND');
        }

        const voucherSeries = await VoucherSerie.query().where(
          'voucher_type_id',
          model.voucherTypeId
        );

        voucherSeries.forEach(async (e) => {
          e.merge({ isActive: false, deletedAt: null });
          await e.useTransaction(trx).save();
        });

        model.merge({
          isActive: true,
          deletedAt: null,
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: `Serie de voucher de ID: ${voucherSerie.id} y SERIE-CORRRELATIVO: ${voucherSerie.seriesCode} - ${voucherSerie.currentNumber} activada correctamente. Los próximos comprobantes de pago se emitiran bajo la misma."`,
        voucherSerie,
      });
    } catch (error) {
      if (error.message === 'VOUCHER_SERIE_NOT_FOUND') {
        return response.notFound({
          message: `Serie de comprobante de pago de ID: ${id} no encontrada, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante el cambio de estado de la serie de comprobante de pago. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }
}
