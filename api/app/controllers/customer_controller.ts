import { HttpContext } from '@adonisjs/core/http';
import { CreateCustomerValidator } from '../validators/create_customer.js';
import db from '@adonisjs/lucid/services/db';
import Customer from '../models/customer.js';
import { UpdateCustomerValidator } from '../validators/update_customer.js';
import { DateTime } from 'luxon';

export default class CustomerController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateCustomerValidator);
    try {
      const customer = await db.transaction(async (trx) => {
        const newCustomer = await Customer.create(
          {
            names: data.names.trim().toUpperCase(),
            surnames: data.surnames.trim().toUpperCase(),
            address: data.address?.trim().toUpperCase(),
            phone: data.phone.trim(),
            email: data.email.trim().toUpperCase(),
            dni: data.dni.trim(),
          },
          { client: trx }
        );
        return newCustomer;
      });

      return response.created({
        message: 'Cliente registrado correctamente.',
        customer,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de cliente, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');
    const customer = await Customer.find(id);
    if (!customer) {
      return response.notFound({
        message: `Cliente de ID: ${id} no encontrado.`,
      });
    }

    await customer.load('sales', (saleQuery) => {
      saleQuery
        .preload('paymentType')
        .preload('voucherType')
        .preload('saleDetails', (saleDetail) => {
          saleDetail.preload('product');
        });
    });
    return response.ok(customer);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'names' | 'dni' | 'all'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'createdAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = Customer.query();
      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'names':
              q.whereILike('names', `%${search}%`);
              break;
            case 'dni':
              q.where('dni', search);
              break;
            case 'all':
            default:
              q.whereILike('names', `%${search}%`).orWhereILike('dni', `%${search}%`);
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

      const customers = await query.orderBy(orderBy, orderDir).paginate(page, limit);
      customers.baseUrl(request.url());
      return response.ok(customers);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de clientes, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateCustomerValidator, {
        meta: { customerId: id },
      });

      const customer = await db.transaction(async (trx) => {
        const model = await Customer.find(id, { client: trx });

        if (!model) {
          throw new Error('CUSTOMER_NOT_FOUND');
        }

        model.merge({
          names: data.names.trim().toUpperCase(),
          surnames: data.surnames.trim().toUpperCase(),
          address: data.address?.trim().toUpperCase(),
          phone: data.phone.trim(),
          email: data.email.trim().toUpperCase(),
          dni: data.dni.trim(),
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: 'Cliente actualizado correctamente',
        customer,
      });
    } catch (error) {
      if (error.message === 'CUSTOMER_NOT_FOUND') {
        return response.notFound({
          message: `Cliente de ID: ${id} no encontrado, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización del cliente. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');
    const customer = await Customer.find(id);
    if (!customer) {
      return response.notFound({
        message: `Cliente de ID: ${id} no encontrado.`,
      });
    }

    await customer.merge({ deletedAt: customer.deletedAt != null ? null : DateTime.utc() }).save();
    return response.ok({
      message: `Cliente de ID: ${id} actualizado correctamente.`,
      customer,
    });
  }
}
