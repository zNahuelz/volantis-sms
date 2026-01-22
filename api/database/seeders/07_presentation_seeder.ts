import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Presentation from '../../app/models/presentation.js';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Presentation.query().first();
    if (hasRecords) {
      return;
    }

    await Presentation.createMany([
      { name: 'Unidad', numericValue: 1, description: 'Producto por unidad' },
      { name: 'Bolsa 50 g', numericValue: 50, description: 'Bolsa pequeña de 50 gramos' },
      { name: 'Bolsa 100 g', numericValue: 100, description: 'Bolsa de 100 gramos' },
      { name: 'Bolsa 250 g', numericValue: 250, description: 'Bolsa mediana de 250 gramos' },
      { name: 'Bolsa 500 g', numericValue: 500, description: 'Bolsa estándar de 500 gramos' },
      { name: 'Bolsa 1 kg', numericValue: 1000, description: 'Bolsa grande de 1 kilogramo' },

      { name: 'Frasco 100 ml', numericValue: 100, description: 'Frasco de 100 mililitros' },
      { name: 'Frasco 250 ml', numericValue: 250, description: 'Frasco de 250 mililitros' },
      { name: 'Frasco 500 ml', numericValue: 500, description: 'Frasco de 500 mililitros' },
      { name: 'Botella 750 ml', numericValue: 750, description: 'Botella de 750 mililitros' },
      { name: 'Botella 1 L', numericValue: 1000, description: 'Botella de 1 litro' },

      { name: 'Pack 2 unidades', numericValue: 2, description: 'Paquete de 2 unidades' },
      { name: 'Pack 3 unidades', numericValue: 3, description: 'Paquete de 3 unidades' },
      { name: 'Pack 6 unidades', numericValue: 6, description: 'Paquete de 6 unidades' },
      { name: 'Pack 10 unidades', numericValue: 10, description: 'Paquete de 10 unidades' },

      { name: 'Caja 12 unidades', numericValue: 12, description: 'Caja con 12 unidades' },
      { name: 'Caja 24 unidades', numericValue: 24, description: 'Caja con 24 unidades' },
      { name: 'Caja 36 unidades', numericValue: 36, description: 'Caja con 36 unidades' },
      { name: 'Caja 48 unidades', numericValue: 48, description: 'Caja con 48 unidades' },
      { name: 'Caja 100 unidades', numericValue: 100, description: 'Caja con 100 unidades' },

      { name: 'Sobre 20 g', numericValue: 20, description: 'Sobre individual de 20 gramos' },
      { name: 'Sachet 30 ml', numericValue: 30, description: 'Sachet de 30 mililitros' },
      { name: 'Paquete 200 g', numericValue: 200, description: 'Paquete de 200 gramos' },

      { name: 'Galón 4 L', numericValue: 4000, description: 'Galón de 4 litros' },
      { name: 'Bidón 5 L', numericValue: 5000, description: 'Bidón de 5 litros' },
      { name: 'Tambor 20 L', numericValue: 20000, description: 'Tambor industrial de 20 litros' },
      { name: 'Saco 25 kg', numericValue: 25000, description: 'Saco de 25 kilogramos' },
      { name: 'Saco 50 kg', numericValue: 50000, description: 'Saco de 50 kilogramos' },
    ]);
  }
}
