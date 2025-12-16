import { HttpContext } from '@adonisjs/core/http';
import { CreatePresentationValidator } from '../validators/create_presentation.js';
import Presentation from '../models/presentation.js';
import db from '@adonisjs/lucid/services/db';
import { UpdatePresentationValidator } from '../validators/update_presentation.js';
import { DateTime } from 'luxon';

export default class PresentationController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreatePresentationValidator);
    try {
      const presentation = await db.transaction(async (trx) => {
        const newPresentation = await Presentation.create(
          {
            name: data.name.trim().toUpperCase(),
            description: data.description?.trim().toUpperCase(),
            numericValue: data.numericValue,
          },
          { client: trx }
        );
        return newPresentation;
      });

      return response.created({
        message: 'Presentacion de producto registrado correctamente.',
        presentation,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de presentación de producto, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');
    const presentation = await Presentation.find(id);
    if (!presentation) {
      return response.notFound({
        message: `Presentación de producto de ID: ${id} no encontrada.`,
      });
    }

    return response.ok(presentation);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'name'  | 'description' | 'all'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'createdAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = Presentation.query();
      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'name':
              q.whereILike('name', `%${search}%`);
              break;
            case 'description':
              q.whereILike('description', `%${search}%`);
              break;
            case 'all':
            default:
              q.whereILike('name', `%${search}%`).orWhereILike('description', `%${search}%`);
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

      const presentations = await query.orderBy(orderBy, orderDir).paginate(page, limit);
      presentations.baseUrl(request.url());
      return response.ok(presentations);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de presentaciones de productos, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdatePresentationValidator, {
        meta: { presentationId: id },
      });

      const presentation = await db.transaction(async (trx) => {
        const model = await Presentation.find(id, { client: trx });

        if (!model) {
          throw new Error('PRESENTATION_NOT_FOUND');
        }

        model.merge({
          name: data.name.trim().toUpperCase(),
          description: data.description?.trim().toUpperCase(),
          numericValue: data.numericValue,
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: 'Cliente actualizado correctamente',
        presentation,
      });
    } catch (error) {
      if (error.message === 'PRESENTATION_NOT_FOUND') {
        return response.notFound({
          message: `Presentación de producto de ID: ${id} no encontrada, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización de la presentación de producto. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');
    const presentation = await Presentation.find(id);
    if (!presentation) {
      return response.notFound({
        message: `Presentación de producto de ID: ${id} no encontrado.`,
      });
    }

    await presentation
      .merge({ deletedAt: presentation.deletedAt != null ? null : DateTime.utc() })
      .save();
    return response.ok({
      message: `Presentación de producto de ID: ${id} actualizada correctamente.`,
      presentation,
    });
  }
}
