import { BaseSeeder } from '@adonisjs/lucid/seeders';
import VoucherType from '../../app/models/voucher_type.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await VoucherType.query().first();
    if (hasRecords) {
      return;
    }

    const boleta = await VoucherType.create({ name: 'BOLETA' });
    await boleta.related('voucherSeries').create({
      seriesCode: 'B001',
      currentNumber: 1,
      isActive: true,
    });

    const factura = await VoucherType.create({ name: 'FACTURA' });
    await factura.related('voucherSeries').create({
      seriesCode: 'F001',
      currentNumber: 1,
      isActive: true,
    });
  }
}
