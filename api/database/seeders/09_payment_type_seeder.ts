import { BaseSeeder } from '@adonisjs/lucid/seeders';
import PaymentType from '../../app/models/payment_type.js';
import app from '@adonisjs/core/services/app';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await PaymentType.query().first();
    if (hasRecords) {
      return;
    }
    if (app.inDev || app.inTest) {
      await PaymentType.createMany([
        { name: 'EFECTIVO', action: 'CASH' },
        { name: 'TARJETA BANCARIA', action: 'DIGITAL' },
        { name: 'YAPE', action: 'DIGITAL' },
        { name: 'PLIN', action: 'DIGITAL' },
        { name: 'TUNKI', action: 'DIGITAL' },
      ]);
    }

    if (app.inProduction) {
      await PaymentType.createMany([
        { name: 'EFECTIVO', action: 'CASH' },
        { name: 'TARJETA BANCARIA', action: 'DIGITAL' },
        { name: 'YAPE', action: 'DIGITAL' },
      ]);
    }
  }
}
