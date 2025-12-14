import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Customer from '../../app/models/customer.js';
import { CustomerFactory } from '../factories/customer_factory.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Customer.query().first();
    if (hasRecords) {
      return;
    }
    await CustomerFactory.createMany(100);
  }
}
