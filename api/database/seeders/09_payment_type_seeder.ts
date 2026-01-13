import { BaseSeeder } from '@adonisjs/lucid/seeders';
import PaymentType from '../../app/models/payment_type.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await PaymentType.query().first();
    if (hasRecords) {
      return;
    }
    await PaymentType.createMany([
      { name: 'EFECTIVO', action: 'CASH' },
      { name: 'TARJETA BANCARIA', action: 'DIGITAL' },
      { name: 'YAPE', action: 'DIGITAL' },
      { name: 'PLIN', action: 'DIGITAL' },
      { name: 'TUNKI', action: 'DIGITAL' },
    ]);
  }
}
