import type { HttpContext } from '@adonisjs/core/http';
import StoreProduct from '../models/store_product.js';
import { DateTime } from 'luxon';
import { CreateStoreProductValidator } from '../validators/create_store_product.js';
import db from '@adonisjs/lucid/services/db';
import { UpdateStoreProductValidator } from '../validators/update_store_product.js';

export default class StoreProductController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateStoreProductValidator);

    try {
      const storeProduct = await db.transaction(async (trx) => {
        const newStoreProduct = await StoreProduct.create(
          {
            storeId: data.storeId,
            productId: data.productId,
            buyPrice: data.buyPrice,
            sellPrice: data.sellPrice,
            igv: data.igv,
            profit: data.profit,
            stock: data.stock,
            salable: data.salable,
          },
          { client: trx }
        );

        return newStoreProduct;
      });

      return response.created({
        message: 'Asignación de producto registrada correctamente',
        storeProduct,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return response.conflict({
          message: 'Este producto ya se encuentra asignado a la tienda',
        });
      }

      return response.badRequest({
        message:
          'Error durante el registro de asignación de producto, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const storeId = request.param('storeId');
    const productId = request.param('productId');
    const storeProduct = await StoreProduct.query()
      .where('store_id', storeId)
      .andWhere('product_id', productId)
      .first();
    if (!storeProduct) {
      return response.notFound({
        message: `Asignación de producto: ID TIENDA: ${storeId} - ID PROD.: ${productId} no encontrada.`,
      });
    }

    await storeProduct.load('product', (productQuery) => {
      productQuery.preload('presentation');
    });
    await storeProduct.load('store');
    return response.ok(storeProduct);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'storeId' | 'productId' | 'barcode'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'updatedAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = StoreProduct.query();

      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'storeId':
              q.where('store_id', search);
              break;
            case 'productId':
              q.where('product_id', search);
              break;
            case 'barcode':
              q.whereHas('product', (productQuery) => {
                productQuery.where('barcode', search);
              });
              break;
            case 'all':
            default:
              q.whereHas('product', (productQuery) => {
                productQuery.where('barcode', search);
              })
                .orWhere('store_id', search)
                .orWhere('product_id', search);
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

      const storeProducts = await query
        .preload('store')
        .preload('product', (productQuery) => {
          productQuery.preload('presentation');
        })
        .orderBy(orderBy, orderDir)
        .paginate(page, limit);

      storeProducts.baseUrl(request.url());
      return response.ok(storeProducts);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de asignaciones de productos, intente nuevamente.',
        error: error.message,
      });
    }
  }

  public async update({ request, response }: HttpContext) {
    const storeId = request.param('storeId');
    const productId = request.param('productId');

    try {
      const data = await request.validateUsing(UpdateStoreProductValidator);

      const storeProduct = await db.transaction(async (trx) => {
        const model = await StoreProduct.query({ client: trx })
          .where('store_id', storeId)
          .andWhere('product_id', productId)
          .first();

        if (!model) {
          throw new Error('STORE_PRODUCT_NOT_FOUND');
        }

        await StoreProduct.query({ client: trx })
          .where('store_id', storeId)
          .andWhere('product_id', productId)
          .update({
            buyPrice: data.buyPrice,
            sellPrice: data.sellPrice,
            igv: data.igv,
            profit: data.profit,
            stock: data.stock,
            salable: data.salable,
            updatedAt: DateTime.now().toJSDate(),
          });

        return model;
      });

      return response.ok({
        message: 'Asignación de producto actualizada correctamente',
        storeProduct,
      });
    } catch (error) {
      if (error.message === 'STORE_PRODUCT_NOT_FOUND') {
        return response.notFound({
          message: `Asignación de producto: ID TIENDA: ${storeId} - ID PROD.: ${productId} no encontrado, actualización cancelada.`,
        });
      }

      if (error.code === 'ER_DUP_ENTRY') {
        return response.conflict({
          message: 'Este producto ya se encuentra asignado a la tienda',
        });
      }

      return response.badRequest({
        message:
          'Error durante la actualización de la asignación de producto. Intente nuevamente o comuniquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async destroy({ request, response }: HttpContext) {
    const storeId = request.param('storeId');
    const productId = request.param('productId');
    const storeProduct = await StoreProduct.query()
      .where('store_id', storeId)
      .andWhere('product_id', productId)
      .first();

    if (!storeProduct) {
      return response.notFound({
        message: `Asignación de producto: ID TIENDA: ${storeId} - ID PROD.: ${productId} no encontrada.`,
      });
    }

    await storeProduct
      .merge({ deletedAt: storeProduct.deletedAt != null ? null : DateTime.utc() })
      .save();

    return response.ok({
      message: `Visibilidad de asignación de producto: ID TIENDA: ${storeId} - ID PROD.: ${productId} actualizada correctamente.`,
      storeProduct,
    });
  }
}
