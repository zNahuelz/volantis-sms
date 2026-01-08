import type { HttpContext } from '@adonisjs/core/http';
import User from '../models/user.js';
import { DateTime } from 'luxon';
import { CreateUserValidator } from '../validators/create_user.js';
import db from '@adonisjs/lucid/services/db';
import { UpdateUserValidator } from '../validators/update_user.js';

export default class UserController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateUserValidator);
    try {
      const user = await db.transaction(async (trx) => {
        const newUser = await User.create(
          {
            names: data.names.trim().toUpperCase(),
            surnames: data.surnames.trim().toUpperCase(),
            dni: data.dni.trim(),
            username: `${data.names.trim().toUpperCase()[0]}${data.surnames.trim().toUpperCase()[0]}${data.dni.trim()}-${new Date().getHours()}`,
            email: data.email.trim().toUpperCase(),
            password: data.dni.trim(),
            profilePicture: null,
            roleId: data.roleId,
            storeId: data.storeId,
          },
          { client: trx }
        );
        return newUser;
      });

      return response.created({
        message: 'Usuario registrado correctamente.',
        user,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de usuario, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');
    const user = await User.find(id);
    if (!user) {
      return response.notFound({
        message: `Usuario de ID: ${id} no encontrado.`,
      });
    }
    await user.load('store');
    await user.load('role', (roleQuery) => {
      roleQuery.preload('abilities');
    });
    return response.ok(user);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'names' | 'username' | 'email' | 'dni' | 'all'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'createdAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = User.query();
      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'names':
              q.whereILike('names', `%${search}%`);
              break;
            case 'username':
              q.whereILike('username', `%${search}%`);
              break;
            case 'email':
              q.whereILike('email', `%${search}%`);
              break;
            case 'dni':
              q.whereILike('dni', `%${search}%`);
              break;
            case 'all':
            default:
              q.whereILike('names', `%${search}%`)
                .orWhereILike('username', `%${search}%`)
                .orWhereILike('email', `%${search}%`);
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

      query.preload('role', (roleQuery) => {
        roleQuery.preload('abilities');
      });

      const users = await query.orderBy(orderBy, orderDir).paginate(page, limit);
      users.baseUrl(request.url());
      return response.ok(users);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de usuarios, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateUserValidator, {
        meta: { userId: id },
      });

      const user = await db.transaction(async (trx) => {
        const model = await User.find(id, { client: trx });

        if (!model) {
          throw new Error('USER_NOT_FOUND');
        }

        model.merge({
          names: data.names.trim().toUpperCase(),
          surnames: data.surnames.trim().toUpperCase(),
          dni: data.dni.trim(),
          email: data.email.trim().toUpperCase(),
          roleId: data.roleId,
          storeId: data.storeId,
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: 'Usuario actualizado correctamente',
        user,
      });
    } catch (error) {
      if (error.message === 'USER_NOT_FOUND') {
        return response.notFound({
          message: `Usuario de ID: ${id} no encontrado, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización del usuario. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');
    const user = await User.find(id);

    if (!user) {
      return response.notFound({
        message: `Usuario de ID: ${id} no encontrado.`,
      });
    }

    const isDisabling = user.deletedAt === null;

    if (isDisabling) {
      user.merge({ deletedAt: DateTime.utc() });
      await user.save();
      const tokens = await User.accessTokens.all(user);
      await Promise.all(tokens.map((token) => User.accessTokens.delete(user, token.identifier)));
    } else {
      user.merge({ deletedAt: null });
      await user.save();
    }

    return response.ok({
      message: `Cuenta de usuario de ID: ${id} actualizada correctamente.`,
      user,
    });
  }
}
