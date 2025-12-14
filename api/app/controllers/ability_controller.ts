import type { HttpContext } from '@adonisjs/core/http';
import Ability from '../models/ability.js';

export default class AbilityController {
  public async show({ request, response }: HttpContext) {
    const id = request.param('id');
    const ability = await Ability.find(id);
    if (!ability) {
      return response.notFound({
        message: `Permiso de ID: ${id} no encontrado.`,
      });
    }
    return response.ok(ability);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'

      const query = Ability.query();

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

      const abilities = await query.orderBy('name', 'asc');

      return response.ok(abilities);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de permisos, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async list({ request, response }: HttpContext) {
    const status = request.input('status', 'available'); //available | all
    const abilitiesQuery = Ability.query().orderBy('name', 'asc');

    switch (status) {
      case 'available':
        abilitiesQuery.whereNull('deleted_at');
        break;
      case 'all':
        break;
      default:
        break;
    }

    const abilities = await abilitiesQuery;
    return response.ok(abilities);
  }
}
