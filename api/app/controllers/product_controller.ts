import { HttpContext } from '@adonisjs/core/http';
import Product from '../models/product.js';
import { CreateProductValidator } from '../validators/create_product.js';
import db from '@adonisjs/lucid/services/db';
import { UpdateProductValidator } from '../validators/update_product.js';
import { DateTime } from 'luxon';

export default class ProductController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateProductValidator);

    try {
      const product = await db.transaction(async (trx) => {
        const newProduct = await Product.create(
          {
            name: data.name.trim().toUpperCase(),
            barcode: data.barcode.trim(),
            description: data.description.trim().toUpperCase(),
            presentationId: data.presentationId,
          },
          { client: trx }
        );

        return newProduct;
      });

      return response.created({
        message: 'Producto registrado correctamente',
        product,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de producto, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');

    const product = await Product.find(id);

    if (!product) {
      return response.notFound({
        message: `Producto de ID: ${id} no encontrado.`,
      });
    }
    await product.load('presentation');
    return response.ok(product);
  }

  public async showByBarcode({ request, response }: HttpContext) {
    const barcode = request.param('barcode');
    const product = await Product.findBy('barcode', barcode);
    if (!product) {
      return response.notFound({
        message: `Producto de código de barras: ${barcode} no encontrado.`,
      });
    }

    await product.load('storeProducts', (storeProductsQuery) => {
      storeProductsQuery.preload('store');
    });

    return response.ok(product);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'name' | 'barcode' | 'description' | 'all'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'updatedAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = Product.query();

      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'name':
              q.whereILike('name', `%${search}%`);
              break;
            case 'barcode':
              q.where('barcode', search);
              break;
            case 'description':
              q.whereILike('description', `%${search}%`);
              break;
            case 'all':
            default:
              q.whereILike('name', `%${search}%`)
                .orWhereILike('barcode', `%${search}%`)
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
          break;
      }

      const products = await query
        .preload('presentation')
        .orderBy(orderBy, orderDir)
        .paginate(page, limit);

      products.baseUrl(request.url());
      return response.ok(products);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de productos, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id');

    try {
      const data = await request.validateUsing(UpdateProductValidator, {
        meta: { productId: id },
      });

      const product = await db.transaction(async (trx) => {
        const model = await Product.find(id, { client: trx });

        if (!model) {
          throw new Error('PRODUCT_NOT_FOUND');
        }

        model.merge({
          name: data.name.trim().toUpperCase(),
          barcode: data.barcode.trim(),
          description: data.description.trim().toUpperCase(),
          presentationId: data.presentationId,
        });

        await model.useTransaction(trx).save();

        return model;
      });

      return response.ok({
        message: 'Producto actualizado correctamente',
        product,
      });
    } catch (error) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        return response.notFound({
          message: `Producto de ID: ${id} no encontrado, actualización cancelada.`,
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización del producto. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const id = request.param('id');
    const product = await Product.find(id);

    if (!product) {
      return response.notFound({ message: `Producto de ID: ${id} no encontrado.` });
    }

    await product.merge({ deletedAt: product.deletedAt != null ? null : DateTime.utc() }).save();

    return response.ok({
      message: `Visibilidad de producto de ID: ${id} actualizada correctamente.`,
      product,
    });
  }

  public async generateRandomBarcode({ response }: HttpContext) {
    const MAX_ATTEMPTS = 100;
    let barcode = '';

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      barcode = this.barcodeFactory();

      const product = await Product.findBy('barcode', barcode);
      if (!product) {
        return response.ok({
          message: 'Código de barras generado correctamente.',
          barcode,
        });
      }
    }

    return response.internalServerError({
      error:
        'No se pudo generar un código de barras único, comuniquese con administración o intente nuevamente.',
    });
  }

  private barcodeFactory() {
    //Range start - end
    const value = Math.floor(Math.random() * (99999999 - 10000 + 1)) + 1;
    return value.toString().padStart(13, '0');
  }
}
