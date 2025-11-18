import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Store from '../../app/models/store.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Store.query().first();
    if (hasRecords) {
      return;
    }
    await Store.create({
      name: 'MASS - SEDE GLOBO TERRAQUEO',
      ruc: '20119988445',
      address: 'Av. Globo Terraqueo 304',
      phone: '999888777',
    });
  }
}
