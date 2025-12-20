import type { HttpContext } from '@adonisjs/core/http';
import { CreateSettingValidator } from '../validators/create_setting.js';
import db from '@adonisjs/lucid/services/db';
import Setting from '../models/setting.js';
import { UpdateSettingValidator } from '../validators/update_setting.js';

export default class SettingController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateSettingValidator);
    try {
      const setting = await db.transaction(async (trx) => {
        const newSetting = await Setting.create(
          {
            key: data.key.trim().toUpperCase(),
            value: data.value,
            valueType: data.valueType.trim().toLowerCase(),
            description: data.description ?? '-----',
          },
          { client: trx }
        );
        return newSetting;
      });

      return response.created({
        message: 'Variable del sistema registrada correctamente.',
        setting,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de variable del sistema, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');
    const setting = await Setting.find(id);
    if (!setting) {
      return response.notFound({
        message: `Variable del sistema de ID: ${id} no encontrada.`,
      });
    }

    return response.ok(setting);
  }

  public async showByKey({ request, response }: HttpContext) {
    const key = request.param('key');
    const setting = await Setting.findBy('key', key.trim().toUpperCase());
    if (!setting) {
      return response.notFound({
        message: `Variable del sistema de clave: ${key} no encontrada.`,
      });
    }

    return response.ok(setting);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'key' | 'value' | 'valueType' | 'description' | 'all'
      const orderBy = request.input('orderBy', 'updatedAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = Setting.query();
      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'key':
              q.whereILike('key', `%${search}%`);
              break;
            case 'value':
              q.whereILike('value', `%${search}%`);
              break;
            case 'valueType':
              q.whereILike('valueType', `%${search}%`);
              break;
            case 'description':
              q.whereILike('description', `%${search}%`);
              break;
            case 'all':
            default:
              q.whereILike('key', `%${search}%`)
                .orWhereILike('value', `%${search}%`)
                .orWhereILike('valueType', `%${search}%`)
                .orWhereILike('description', `%${search}%`);
              break;
          }
        });
      }

      const settings = await query.orderBy(orderBy, orderDir).paginate(page, limit);
      settings.baseUrl(request.url());
      return response.ok(settings);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de variables del sistema, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateSettingValidator, {
        meta: { settingId: id },
      });

      const setting = await db.transaction(async (trx) => {
        const model = await Setting.find(id, { client: trx });

        if (!model) {
          throw new Error('SETTING_NOT_FOUND');
        }

        model.merge({
          key: data.key.trim().toUpperCase(),
          value: data.value,
          valueType: data.valueType.trim().toLowerCase(),
          description: data.description ?? '-----',
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: 'Variable del sistema actualizada correctamente',
        setting,
      });
    } catch (error) {
      if (error.message === 'SETTING_NOT_FOUND') {
        return response.notFound({
          message: `Variable del sistema de ID: ${id} no encontrada, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización de la variable del sistema. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');
    const setting = await Setting.find(id);
    if (!setting) {
      return response.notFound({
        message: `Variable del sistema de ID: ${id} no encontrada.`,
      });
    }

    await setting.delete();
    return response.ok({
      message: `Variable del sistema de ID: ${id} eliminada correctamente.`,
    });
  }
}
