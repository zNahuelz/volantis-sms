import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Setting from '../../app/models/setting.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Setting.query().first();
    if (hasRecords) {
      return;
    }
    await Setting.create({
      key: 'VALOR_IGV',
      value: '0.18',
      valueType: 'decimal',
      description: 'Controla el valor del IGV en el sistema.',
    });
  }
}
