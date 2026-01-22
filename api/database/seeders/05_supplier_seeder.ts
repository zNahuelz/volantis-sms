import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { SupplierFactory } from '../factories/supplier_factory.js';
import Supplier from '../../app/models/supplier.js';
import app from '@adonisjs/core/services/app';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Supplier.query().first();
    if (hasRecords) {
      return;
    }

    if (app.inProduction) {
      await SupplierFactory.createMany(2);
    }

    if (app.inDev || app.inTest) {
      await SupplierFactory.createMany(100);
    }
  }
}
