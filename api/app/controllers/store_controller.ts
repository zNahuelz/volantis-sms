import type { HttpContext } from '@adonisjs/core/http';
import { CreateStoreValidator } from '../validators/store/create_store.js';
import db from '@adonisjs/lucid/services/db';
import Store from '../models/store.js';
import { UpdateStoreValidator } from '../validators/store/update_store.js';
import { DateTime } from 'luxon';
import User from '../models/user.js';

export default class StoreController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateStoreValidator);
    try {
      const store = await db.transaction(async (trx) => {
        const newStore = await Store.create(
          {
            name: data.name.trim().toUpperCase(),
            ruc: data.ruc.trim(),
            address: data.address.trim().toUpperCase(),
            phone: data.phone.trim(),
          },
          { client: trx }
        );
        return newStore;
      });

      return response.created({
        message: 'Tienda registrada correctamente.',
        store,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de tienda, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');
    const store = await Store.find(id);
    if (!store) {
      return response.notFound({
        message: `Tienda de ID: ${id} no encontrada.`,
      });
    }

    return response.ok(store);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'name' | 'ruc' | 'address' | 'all'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'createdAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = Store.query();
      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'name':
              q.whereILike('name', `%${search}%`);
              break;
            case 'ruc':
              q.where('ruc', search);
              break;
            case 'address':
              q.whereILike('address', `%${search}%`);
              break;
            case 'all':
            default:
              q.whereILike('name', `%${search}%`)
                .orWhereILike('ruc', `%${search}%`)
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

      query.preload('sales');

      const stores = await query.orderBy(orderBy, orderDir).paginate(page, limit);
      stores.baseUrl(request.url());
      return response.ok(stores);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de tiendas, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async list({ request, response }: HttpContext) {
    const status = request.input('status', 'available'); //available | all
    const storesQuery = Store.query().orderBy('name', 'asc');

    switch (status) {
      case 'available':
        storesQuery.whereNull('deleted_at');
        break;
      case 'all':
        break;
      default:
        break;
    }

    const stores = await storesQuery;
    return response.ok(stores);
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateStoreValidator, {
        meta: { storeId: id },
      });

      const store = await db.transaction(async (trx) => {
        const model = await Store.find(id, { client: trx });

        if (!model) {
          throw new Error('STORE_NOT_FOUND');
        }

        model.merge({
          name: data.name.trim().toUpperCase(),
          ruc: data.ruc.trim(),
          address: data.address.trim().toUpperCase(),
          phone: data.phone.trim(),
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: 'Tienda actualizada correctamente',
        store,
      });
    } catch (error) {
      if (error.message === 'STORE_NOT_FOUND') {
        return response.notFound({
          message: `Tienda de ID: ${id} no encontrada, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización de la tienda. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const store = await db.transaction(async (trx) => {
        const model = await Store.find(id, { client: trx });

        if (!model) {
          throw new Error('STORE_NOT_FOUND');
        }

        const isDeleting = model.deletedAt === null;
        const now = DateTime.utc();

        model.merge({
          deletedAt: isDeleting ? now : null,
        });

        await model.useTransaction(trx).save();

        if (isDeleting) {
          const users = await model
            .related('users')
            .query()
            .whereNull('deleted_at')
            .whereDoesntHave('role', (roleQuery) => {
              roleQuery.whereHas('abilities', (abilityQuery) => {
                abilityQuery.where('_key', 'sys:admin');
              });
            });

          for (const user of users) {
            user.merge({ deletedAt: now });
            await user.useTransaction(trx).save();
            const tokens = await User.accessTokens.all(user);

            await Promise.all(
              tokens.map((token) => User.accessTokens.delete(user, token.identifier))
            );
          }
        } else {
          const users = await model.related('users').query().whereNotNull('deleted_at');
          for (const user of users) {
            user.merge({ deletedAt: null });
            await user.save();
          }
        }

        return model;
      });

      return response.ok({
        message: `Tienda de ID: ${id} actualizada correctamente.`,
        store,
      });
    } catch (error) {
      if (error.message === 'STORE_NOT_FOUND') {
        return response.notFound({
          message: `Tienda de ID: ${id} no encontrada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la deshabilitación de la tienda. Intente nuevamente o comuníquese con administración.',
        errors: error.message,
      });
    }
  }
}
