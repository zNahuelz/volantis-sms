import type { HttpContext } from '@adonisjs/core/http';
import Role from '../models/role.js';
import { DateTime } from 'luxon';
import { CreateRoleValidator } from '../validators/role/create_role.js';
import db from '@adonisjs/lucid/services/db';
import Ability from '../models/ability.js';
import { UpdateRoleValidator } from '../validators/role/update_role.js';

export default class RoleController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateRoleValidator);
    try {
      const role = await db.transaction(async (trx) => {
        const newRole = await Role.create(
          {
            name: data.name.trim().toUpperCase(),
          },
          { client: trx }
        );

        const adminAbility = await Ability.query({ client: trx })
          .where('key', 'sys:admin')
          .select('id')
          .first();

        let abilitiesIdsToAttach = data.abilitiesIds;

        if (adminAbility && data.abilitiesIds.includes(adminAbility.id)) {
          abilitiesIdsToAttach = [adminAbility.id];
        }

        await newRole.related('abilities').attach(abilitiesIdsToAttach, trx);

        await newRole.load('abilities');

        return newRole;
      });
      return response.created({
        message: 'Rol registrado correctamente.',
        role,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de rol, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

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

  public async list({ request, response }: HttpContext) {
    const status = request.input('status', 'available'); //available | all
    const rolesQuery = Role.query().preload('abilities').orderBy('updated_at', 'desc');

    switch (status) {
      case 'available':
        rolesQuery.whereNull('deleted_at');
        break;
      case 'all':
        break;
      default:
        break;
    }

    const roles = await rolesQuery;
    return response.ok(roles);
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateRoleValidator, {
        meta: { roleId: id },
      });

      const role = await db.transaction(async (trx) => {
        const model = await Role.find(id, { client: trx });

        if (!model) {
          throw new Error('ROLE_NOT_FOUND');
        }
        model.useTransaction(trx);

        await model
          .merge({
            name: data.name.trim().toUpperCase(),
          })
          .save();

        const adminAbility = await Ability.query({ client: trx })
          .where('key', 'sys:admin')
          .select('id')
          .first();

        let abilitiesIdsToSync = data.abilitiesIds;

        if (adminAbility && data.abilitiesIds.includes(adminAbility.id)) {
          abilitiesIdsToSync = [adminAbility.id];
        }

        await model.related('abilities').sync(abilitiesIdsToSync);

        await model.load('abilities');

        return model;
      });

      return response.ok({
        message: 'Rol actualizado correctamente',
        role,
      });
    } catch (error) {
      if (error.message === 'ROLE_NOT_FOUND') {
        return response.notFound({
          message: `Rol de ID: ${id} no encontrado, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización del rol. Intente nuevamente o comuníquese con administración.',
        errors: error.messages || error.message,
      });
    }
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
