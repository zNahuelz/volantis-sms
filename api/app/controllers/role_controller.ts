import type { HttpContext } from '@adonisjs/core/http';
import Role from '../models/role.js';
import { DateTime } from 'luxon';

export default class RoleController {
  public async show({ request, response }: HttpContext) {
    const id = request.param('id');
    const role = await Role.find(id);
    if (!role) {
      return response.notFound({
        message: `Rol de ID: ${id} no encontrado.`,
      });
    }

    await role.load('abilities');

    return response.ok(role);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'

      const query = Role.query().preload('abilities');

      switch (status) {
        case 'deleted':
          query.whereNotNull('deleted_at');
          break;
        case 'available':
          query.whereNull('deleted_at');
          break;
        case 'all':
        default:
          break;
      }

      const roles = await query.orderBy('name', 'asc');

      return response.ok(roles);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de roles, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async list({ response }: HttpContext) {
    const roles = await Role.query()
      .whereNull('deleted_at')
      .preload('abilities')
      .orderBy('updated_at');

    return response.ok(roles);
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');
    const role = await Role.find(id);
    if (!role) {
      return response.notFound({
        message: `Rol de ID: ${id} no encontrado.`,
      });
    }

    await role.merge({ deletedAt: role.deletedAt != null ? null : DateTime.utc() }).save();
    return response.ok({
      message: `Rol de ID: ${id} actualizado correctamente.`,
      role,
    });
  }
}
