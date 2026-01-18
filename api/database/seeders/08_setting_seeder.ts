import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Setting from '../../app/models/setting.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Setting.query().first();
    if (hasRecords) {
      return;
    }
    await Setting.createMany([
      {
        key: 'VALOR_IGV',
        value: '0.18',
        valueType: 'decimal',
        description: 'Controla el valor del IGV en el sistema.',
      },
      {
        key: 'MODO_VENTAS',
        value: 'free',
        valueType: 'string',
        description:
          'Módulo de ventas: "strict" => No permite vender productos con stock <= 0 | "free" => Permite vender productos con stock <= 0',
      },
    ]);
  }
}
