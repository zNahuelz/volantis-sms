import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Customer from '../../app/models/customer.js';
import { CustomerFactory } from '../factories/customer_factory.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Customer.query().first();
    if (hasRecords) {
      return;
    }
    await Customer.create({
      names: 'CLIENTE',
      surnames: 'ORDINARIO',
      dni: '00000000',
      phone: '000000000',
      email: 'default-customer@volantis.com',
      address: 'Av. Globo Terraqueo 102',
    });
    await CustomerFactory.createMany(99);
  }
}
