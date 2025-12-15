import type { HttpContext } from '@adonisjs/core/http';
import Ability from '../models/ability.js';
import { CreateAbilityValidator } from '../validators/create_ability.js';
import db from '@adonisjs/lucid/services/db';
import { UpdateAbilityValidator } from '../validators/update_ability.js';

export default class AbilityController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateAbilityValidator);

    try {
      const ability = await db.transaction(async (trx) => {
        const newAbility = await Ability.create(
          {
            name: data.name.trim().toUpperCase(),
            key: data.key.trim().toLowerCase(),
            description: data.description.trim().toUpperCase(),
          },
          { client: trx }
        );

        return newAbility;
      });

      return response.created({
        message: 'Permiso registrado correctamente',
        ability,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de permiso, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

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
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'name' | 'key' | 'description' | 'all'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'updatedAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = Ability.query();

      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'name':
              q.whereILike('name', `%${search}%`);
              break;
            case 'key':
              q.whereILike('_key', `%${search}%`);
              break;
            case 'description':
              q.whereILike('description', `%${search}%`);
              break;

            case 'all':
            default:
              q.whereILike('name', `%${search}%`)
                .orWhereILike('key', `%${search}%`)
                .orWhereILike('description', `%${search}%`);
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
        default:
          break;
      }

      const abilities = await query.orderBy(orderBy, orderDir).paginate(page, limit);
      abilities.baseUrl(request.url());
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

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateAbilityValidator, {
        meta: { abilityId: id },
      });

      const ability = await db.transaction(async (trx) => {
        const model = await Ability.find(id, { client: trx });

        if (!model) {
          throw new Error('ABILITY_NOT_FOUND');
        }

        model.merge({
          name: data.name.trim().toUpperCase(),
          key: data.key.trim().toLowerCase(),
          description: data.description.trim().toUpperCase(),
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: 'Permiso actualizado correctamente',
        ability,
      });
    } catch (error) {
      if (error.message === 'ABILITY_NOT_FOUND') {
        return response.notFound({
          message: `Permiso de ID: ${id} no encontrado, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización del permiso. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }
}
