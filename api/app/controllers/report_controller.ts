import { HttpContext } from '@adonisjs/core/http';
import Sale from '../models/sale.js';
import fs from 'node:fs/promises';
import PdfService from '../services/pdf_service.js';
import app from '@adonisjs/core/services/app';
import { formatAsDatetime, sunatRound } from '../utils/helpers.js';
import { GenerateSalesReportValidator } from '../validators/report/generate_sales_report.js';
import { DateTime } from 'luxon';
import db from '@adonisjs/lucid/services/db';

export default class ReportController {
  public async generateSalesReport({ request, response }: HttpContext) {
    const { type, date } = await request.validateUsing(GenerateSalesReportValidator);

    const parsedDate = DateTime.fromFormat(date, 'yyyy-MM-dd');

    if (!parsedDate.isValid) {
      return response.badRequest({ message: 'Fecha inválida.' });
    }

    const baseQuery = Sale.query();

    switch (type) {
      case 'by_day': {
        baseQuery.whereBetween('sales.created_at', [
          parsedDate.startOf('day').toSQL(),
          parsedDate.endOf('day').toSQL(),
        ]);
        break;
      }

      case 'by_week': {
        baseQuery.whereBetween('sales.created_at', [
          parsedDate.startOf('week').toSQL(),
          parsedDate.endOf('week').toSQL(),
        ]);
        break;
      }

      case 'by_month': {
        baseQuery.whereBetween('sales.created_at', [
          parsedDate.startOf('month').toSQL(),
          parsedDate.endOf('month').toSQL(),
        ]);
        break;
      }

      case 'by_year': {
        baseQuery.whereBetween('sales.created_at', [
          parsedDate.startOf('year').toSQL(),
          parsedDate.endOf('year').toSQL(),
        ]);
        break;
      }

      default:
        return response.badRequest({ message: 'Tipo de reporte inválido.' });
    }

    const aggregates = await baseQuery
      .clone()
      .select(
        db.raw('COUNT(*) as total_sales'),
        db.raw('AVG(total) as average_sale'),
        db.raw('AVG(igv) as average_igv'),
        db.raw('AVG(subtotal) as average_subtotal'),
        db.raw('AVG(`change`) as average_change'),
        db.raw('AVG(`cash_received`) as average_received_cash'),
        db.raw('MAX(total) as max_sale'),
        db.raw('MIN(total) as min_sale')
      )
      .first();

    if (!aggregates || Number(aggregates.$extras.total_sales) === 0) {
      return response.notFound({
        message:
          'No se encontraron ventas registradas durante el período ingresado. Vuelva a intentarlo seleccionando un período distinto o registre algunas ventas.',
      });
    }

    const highestSale = await baseQuery.clone().orderBy('total', 'desc').first();

    const lowestSale = await baseQuery.clone().orderBy('total', 'asc').first();

    const paymentStats = await baseQuery
      .clone()
      .join('payment_types', 'payment_types.id', 'sales.payment_type_id')
      .groupBy('payment_types.name')
      .select('payment_types.name as payment_name', db.raw('COUNT(*) as count'));

    const paymentMap = Object.fromEntries(
      paymentStats.map((p) => [p.$extras.payment_name, Number(p.$extras.count)])
    );

    const voucherStats = await baseQuery
      .clone()
      .join('voucher_types', 'voucher_types.id', 'sales.voucher_type_id')
      .groupBy('voucher_types.name')
      .select('voucher_types.name as voucher_name', db.raw('COUNT(*) as count'));

    const voucherMap = Object.fromEntries(
      voucherStats.map((v) => [v.$extras.voucher_name, Number(v.$extras.count)])
    );

    return response.ok({
      reportType: type,
      date: date,
      totalSales: Number(aggregates.$extras.total_sales),

      highestSale: highestSale,
      lowestSale: lowestSale,

      paidCash: paymentMap['EFECTIVO'] ?? 0,
      paidCard: paymentMap['TARJETA BANCARIA'] ?? 0,
      paidYape: paymentMap['YAPE'] ?? 0,
      paidPlin: paymentMap['PLIN'] ?? 0,
      paidTunki: paymentMap['TUNKI'] ?? 0,

      boleta: voucherMap['BOLETA'] ?? 0,
      factura: voucherMap['FACTURA'] ?? 0,

      averageSale: Number(aggregates.$extras.average_sale ?? 0).toFixed(2),
      averageIgv: Number(aggregates.$extras.average_igv ?? 0).toFixed(2),
      averageSubtotal: Number(aggregates.$extras.average_subtotal ?? 0).toFixed(2),
      averageChange: Number(aggregates.$extras.average_change ?? 0).toFixed(2),
    });
  }

  public async getVoucherPdfById({ request, response, params }: HttpContext) {
    const sale = await Sale.find(params.id);

    if (!sale) {
      return response.notFound({
        message: `Venta de ID: ${params.id} no encontrado, intente nuevamente.`,
      });
    }

    await sale.load('customer');
    await sale.load('user');
    await sale.load('voucherType');
    await sale.load('paymentType');
    await sale.load('store');
    await sale.load('saleDetails', async (saleDetailsQuery) => {
      await saleDetailsQuery.preload('product', async (productQuery) => {
        await productQuery.preload('presentation');
      });
    });

    const address = sale.store?.address ?? '-----';
    const ruc = sale.store?.ruc ?? '-----';

    const logoPath = app.makePath('resources/images/volLogoFullTransparent.png');
    const logoBase64 = await fs.readFile(logoPath, 'base64');
    const image = `data:image/png;base64,${logoBase64}`;

    const detailsChunks = sale.saleDetails.reduce<any[][]>((acc, item, i) => {
      const chunkIndex = Math.floor(i / 20);
      acc[chunkIndex] ||= [];
      acc[chunkIndex].push(item);
      return acc;
    }, []);

    const pdf = await PdfService.loadView('pdfs/bol_voucher', {
      data: sale,
      address,
      ruc,
      logo: image,
      chunks: detailsChunks,
      sunatRound: sunatRound,
      formatAsDateTime: formatAsDatetime,
    });

    const fileName = `${sale.set}-${sale.correlative}.pdf`;

    const result = request.input('download') ? pdf.download(fileName) : pdf.stream(fileName);

    response
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', result.disposition)
      .send(result.buffer);
  }
}
