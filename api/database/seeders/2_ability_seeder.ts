import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Ability from '../../app/models/ability.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Ability.query().first();
    if (hasRecords) {
      return;
    }
    await Ability.createMany([
      {
        name: 'Permisos administrativos.',
        key: 'sys:admin',
        description: 'Permite el uso de todas las funciones del sistema.',
      },
    ]);
  }
}
