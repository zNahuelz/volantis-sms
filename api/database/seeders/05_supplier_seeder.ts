import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { SupplierFactory } from '../factories/supplier_factory.js';
import Supplier from '../../app/models/supplier.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Supplier.query().first();
    if (hasRecords) {
      return;
    }
    await SupplierFactory.createMany(100);
  }
}
