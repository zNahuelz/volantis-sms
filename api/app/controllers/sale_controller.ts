import type { HttpContext } from '@adonisjs/core/http';
import { CreateSaleValidator } from '../validators/sale/create_sale.js';
import db from '@adonisjs/lucid/services/db';
import Sale from '../models/sale.js';
import VoucherSerie from '../models/voucher_serie.js';
import SaleDetail from '../models/sale_detail.js';
import StoreProduct from '../models/store_product.js';

export default class SaleController {
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateSaleValidator);

    try {
      const sale = await db.transaction(async (trx) => {
        const voucherSerie = await VoucherSerie.query({ client: trx })
          .where('voucher_type_id', data.voucherTypeId)
          .andWhere('is_active', true)
          .forUpdate()
          .first();

        if (!voucherSerie) {
          throw new Error(
            `No se encontró una serie activa para el tipo de voucher ID: ${data.voucherTypeId}`
          );
        }

        let next = voucherSerie.currentNumber;
        let correlative = String(next).padStart(8, '0');

        while (
          await Sale.query({ client: trx })
            .where('correlative', correlative)
            .andWhere('_set', voucherSerie.seriesCode)
            .first()
        ) {
          next++;
          correlative = String(next).padStart(8, '0');
        }

        voucherSerie.currentNumber = next + 1;
        await voucherSerie.save();

        const newSale = await Sale.create(
          {
            change: data.change,
            cashReceived: data.cashReceived,
            igv: data.igv,
            subtotal: data.subtotal,
            total: data.total,
            set: voucherSerie.seriesCode,
            correlative: correlative,
            paymentHash: data.paymentHash ?? null,
            storeId: data.storeId,
            customerId: data.customerId,
            voucherTypeId: data.voucherTypeId,
            paymentTypeId: data.paymentTypeId,
            userId: data.userId,
          },
          { client: trx }
        );

        const saleDetailsPayload = data.cartItems.map((item) => ({
          saleId: newSale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }));

        await SaleDetail.createMany(saleDetailsPayload, { client: trx });

        for (const item of data.cartItems) {
          const storeProduct = await StoreProduct.query({ client: trx })
            .where('store_id', data.storeId)
            .andWhere('product_id', item.productId)
            .forUpdate()
            .first();

          if (!storeProduct) {
            throw new Error(`Producto ID ${item.productId} no está registrado en la tienda`);
          }
          const newStock = storeProduct.stock - item.quantity;

          await StoreProduct.query({ client: trx })
            .where('store_id', data.storeId)
            .andWhere('product_id', item.productId)
            .update({
              stock: newStock > 0 ? newStock : 0,
            });
        }

        return newSale;
      });

      return response.created({
        message: 'Venta registrada correctamente',
        sale,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el registro de venta, operación cancelada. Intente nuevamente o comuniquese con administración.',
        error: error.messages || error.message,
      });
    }
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id');

    const sale = await Sale.find(id);

    if (!sale) {
      return response.notFound({
        message: `Comprobante de venta de ID: ${id} no encontrado.`,
      });
    }

    await sale.load('customer');
    await sale.load('paymentType');
    await sale.load('voucherType');
    await sale.load('store');
    await sale.load('user');
    await sale.load('saleDetails', async (saleDetailQuery) => {
      await saleDetailQuery.preload('product', (productQuery) => {
        productQuery.preload('presentation');
      });
    });

    return response.ok(sale);
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = request.input('limit', 10);
      const search = request.input('search', '');
      const searchBy = request.input('searchBy', 'all'); // 'id' | 'set' | 'correlative' | 'dni' | 'storeId'  | 'paymentTypeId' | 'voucherTypeId' | 'all'
      const status = request.input('status', 'available'); // 'available' | 'deleted' | 'all'
      const orderBy = request.input('orderBy', 'createdAt');
      const orderDir = request.input('orderDir', 'desc'); // 'asc' | 'desc'

      const query = Sale.query();

      if (search) {
        query.where((q) => {
          switch (searchBy) {
            case 'id':
              q.where('id', search);
              break;
            case 'set':
              q.whereILike('_set', `%${search}%`);
              break;
            case 'correlative':
              q.whereILike('correlative', `%${search}%`);
              break;
            case 'dni':
              q.whereHas('customer', (customerQuery) => {
                customerQuery.where('dni', search);
              });
              break;
            case 'storeId':
              q.where('store_id', search);
              break;
            case 'paymentTypeId':
              q.where('payment_type_id', search);
              break;
            case 'voucherTypeId':
              q.where('voucher_type_id', search);
              break;
            case 'all':
            default:
              q.whereILike('_set', `%${search}%`)
                .orWhereILike('correlative', `%${search}%`)
                .orWhereHas('customer', (customerQuery) => {
                  customerQuery.where('dni', search);
                });
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

      const sales = await query
        .preload('customer')
        .preload('store')
        .orderBy(orderBy, orderDir)
        .paginate(page, limit);

      sales.baseUrl(request.url());
      return response.ok(sales);
    } catch (error) {
      return response.internalServerError({
        message: 'Error en el listado de comprobantes de venta, intente nuevamente.',
        error: error.message,
      });
    }
  }
}
