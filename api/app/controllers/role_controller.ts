import type { HttpContext } from '@adonisjs/core/http';
import Role from '../models/role.js';

export default class RoleController {
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
}
