import type { HttpContext } from '@adonisjs/core/http';
import BuyOrder from '../models/buy_order.js';
import { DateTime } from 'luxon';
import db from '@adonisjs/lucid/services/db';
import { CreateBuyOrderValidator } from '../validators/create_buy_order.js';
import { UpdateBuyOrderValidator } from '../validators/update_buy_order.js';

export default class BuyOrderController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateBuyOrderValidator);
    try {
      const buyOrder = await db.transaction(async (trx) => {
        const newBuyOrder = await BuyOrder.create(
          {
            status: data.status.trim().toUpperCase(),
            supplierId: data.supplierId,
            storeId: data.storeId,
          },
          { client: trx }
        );

        await newBuyOrder.related('buyOrderDetails').createMany(
          data.buyOrderDetails.map((detail) => ({
            productId: detail.productId,
            quantity: detail.quantity,
            unitCost: detail.unitCost,
          })),
          { client: trx }
        );

        await newBuyOrder.load('buyOrderDetails');

        return newBuyOrder;
      });
      return response.created({
        message: 'Orden de compra registrada correctamente.',
        buyOrder,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de orden de compra, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');
    const buyOrder = await BuyOrder.find(id);
    if (!buyOrder) {
      return response.notFound({
        message: `Orden de compra de ID: ${id} no encontrado.`,
      });
    }

    await buyOrder.load('store');
    await buyOrder.load('supplier');
    await buyOrder.load('buyOrderDetails', (buyOrderQuery) => {
      buyOrderQuery.preload('product');
    });
    return response.ok(buyOrder);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'status' | 'supplierId' | 'storeId'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'updatedAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = BuyOrder.query();

      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'status':
              q.where('status', search);
              break;
            case 'supplierId':
              q.where('supplier_id', search);
              break;
            case 'storeId':
              q.where('store_id', search);
              break;
            case 'all':
            default:
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

      const buyOrders = await query.orderBy(orderBy, orderDir).paginate(page, limit);

      buyOrders.baseUrl(request.url());
      return response.ok(buyOrders);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de ordenes de compra, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateBuyOrderValidator);

      const buyOrder = await db.transaction(async (trx) => {
        const model = await BuyOrder.find(id, { client: trx });

        if (!model) {
          throw new Error('BUY_ORDER_NOT_FOUND');
        }
        model.useTransaction(trx);

        await model
          .merge({
            status: data.status.trim().toUpperCase(),
            supplierId: data.supplierId,
            storeId: data.storeId,
          })
          .save();

        await model.related('buyOrderDetails').updateOrCreateMany(
          data.buyOrderDetails.map((detail) => ({
            productId: detail.productId,
            quantity: detail.quantity,
            unitCost: detail.unitCost,
          }))
        );

        await model.load('buyOrderDetails');

        return model;
      });

      return response.ok({
        message: 'Orden de compra actualizada correctamente',
        buyOrder,
      });
    } catch (error) {
      if (error.message === 'BUY_ORDER_NOT_FOUND') {
        return response.notFound({
          message: `Orden de compra de ID: ${id} no encontrada, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización de orden de compra. Intente nuevamente o comuníquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');
    const buyOrder = await BuyOrder.find(id);

    if (!buyOrder) {
      return response.notFound({ message: `Orden de compra de ID: ${id} no encontrada.` });
    }

    await buyOrder.merge({ deletedAt: buyOrder.deletedAt != null ? null : DateTime.utc() }).save();

    return response.ok({
      message: `Visibilidad de orden de compra de ID: ${id} actualizada correctamente.`,
      buyOrder,
    });
  }
}
