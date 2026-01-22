import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Product from '../../app/models/product.js';
import app from '@adonisjs/core/services/app';

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await Product.query().first();
    if (hasRecords) {
      return;
    }

    if (app.inDev || app.inTest) {
      await Product.createMany([
        {
          name: 'Azúcar Blanca',
          barcode: '7750000000011',
          description: 'Azúcar refinada para consumo diario',
          presentationId: 4,
        },
        {
          name: 'Arroz Extra',
          barcode: '7750000000012',
          description: 'Arroz de grano largo',
          presentationId: 6,
        },
        {
          name: 'Aceite Vegetal',
          barcode: '7750000000013',
          description: 'Aceite vegetal comestible',
          presentationId: 11,
        },
        {
          name: 'Sal de Mesa',
          barcode: '7750000000014',
          description: 'Sal yodada fina',
          presentationId: 2,
        },
        {
          name: 'Fideos Spaghetti',
          barcode: '7750000000015',
          description: 'Pasta larga tipo spaghetti',
          presentationId: 5,
        },

        {
          name: 'Harina de Trigo',
          barcode: '7750000000016',
          description: 'Harina de trigo sin preparar',
          presentationId: 27,
        },
        {
          name: 'Leche Entera',
          barcode: '7750000000017',
          description: 'Leche entera pasteurizada',
          presentationId: 10,
        },
        {
          name: 'Café Molido',
          barcode: '7750000000018',
          description: 'Café tostado y molido',
          presentationId: 3,
        },
        {
          name: 'Avena Integral',
          barcode: '7750000000019',
          description: 'Avena integral natural',
          presentationId: 23,
        },
        {
          name: 'Mantequilla',
          barcode: '7750000000020',
          description: 'Mantequilla sin sal',
          presentationId: 1,
        },

        {
          name: 'Detergente en Polvo',
          barcode: '7750000000021',
          description: 'Detergente multiuso',
          presentationId: 28,
        },
        {
          name: 'Jabón Líquido',
          barcode: '7750000000022',
          description: 'Jabón líquido antibacterial',
          presentationId: 9,
        },
        {
          name: 'Shampoo Familiar',
          barcode: '7750000000023',
          description: 'Shampoo para todo tipo de cabello',
          presentationId: 11,
        },
        {
          name: 'Cloro Doméstico',
          barcode: '7750000000024',
          description: 'Desinfectante a base de cloro',
          presentationId: 24,
        },
        {
          name: 'Limpiavidrios',
          barcode: '7750000000025',
          description: 'Limpiador para superficies de vidrio',
          presentationId: 7,
        },

        {
          name: 'Agua Mineral',
          barcode: '7750000000026',
          description: 'Agua mineral sin gas',
          presentationId: 10,
        },
        {
          name: 'Gaseosa Cola',
          barcode: '7750000000027',
          description: 'Bebida gaseosa sabor cola',
          presentationId: 11,
        },
        {
          name: 'Jugo de Naranja',
          barcode: '7750000000028',
          description: 'Jugo natural de naranja',
          presentationId: 8,
        },
        {
          name: 'Bebida Energética',
          barcode: '7750000000029',
          description: 'Bebida energética',
          presentationId: 7,
        },
        {
          name: 'Cerveza Lager',
          barcode: '7750000000030',
          description: 'Cerveza tipo lager',
          presentationId: 10,
        },

        {
          name: 'Galletas Dulces',
          barcode: '7750000000031',
          description: 'Galletas dulces surtidas',
          presentationId: 12,
        },
        {
          name: 'Galletas Saladas',
          barcode: '7750000000032',
          description: 'Galletas saladas crocantes',
          presentationId: 13,
        },
        {
          name: 'Chocolate en Barra',
          barcode: '7750000000033',
          description: 'Chocolate con leche',
          presentationId: 1,
        },
        {
          name: 'Caramelos Surtidos',
          barcode: '7750000000034',
          description: 'Caramelos de varios sabores',
          presentationId: 14,
        },
        {
          name: 'Chicles',
          barcode: '7750000000035',
          description: 'Chicles sabor menta',
          presentationId: 15,
        },

        {
          name: 'Atún en Lata',
          barcode: '7750000000036',
          description: 'Atún en conserva',
          presentationId: 16,
        },
        {
          name: 'Sardinas',
          barcode: '7750000000037',
          description: 'Sardinas en aceite vegetal',
          presentationId: 17,
        },
        {
          name: 'Aceitunas Verdes',
          barcode: '7750000000038',
          description: 'Aceitunas verdes en salmuera',
          presentationId: 3,
        },
        {
          name: 'Maíz Dulce',
          barcode: '7750000000039',
          description: 'Maíz dulce en conserva',
          presentationId: 18,
        },
        {
          name: 'Frejoles Negros',
          barcode: '7750000000040',
          description: 'Frejoles negros seleccionados',
          presentationId: 19,
        },

        {
          name: 'Arvejas Partidas',
          barcode: '7750000000041',
          description: 'Arvejas secas partidas',
          presentationId: 20,
        },
        {
          name: 'Lentejas',
          barcode: '7750000000042',
          description: 'Lentejas secas',
          presentationId: 23,
        },
        {
          name: 'Quinua Blanca',
          barcode: '7750000000043',
          description: 'Quinua blanca premium',
          presentationId: 4,
        },
        {
          name: 'Chía',
          barcode: '7750000000044',
          description: 'Semillas de chía',
          presentationId: 21,
        },
        {
          name: 'Linaza',
          barcode: '7750000000045',
          description: 'Semillas de linaza',
          presentationId: 21,
        },

        {
          name: 'Alcohol Medicinal',
          barcode: '7750000000046',
          description: 'Alcohol etílico 70%',
          presentationId: 9,
        },
        {
          name: 'Agua Oxigenada',
          barcode: '7750000000047',
          description: 'Peróxido de hidrógeno',
          presentationId: 7,
        },
        {
          name: 'Gel Antibacterial',
          barcode: '7750000000048',
          description: 'Gel antibacterial para manos',
          presentationId: 8,
        },
        {
          name: 'Desinfectante Multiuso',
          barcode: '7750000000049',
          description: 'Desinfectante de superficies',
          presentationId: 25,
        },
        {
          name: 'Limpiador Industrial',
          barcode: '7750000000050',
          description: 'Limpiador concentrado industrial',
          presentationId: 26,
        },
      ]);
    }

    if (app.inProduction) {
      await Product.createMany([
        {
          name: 'Azúcar Blanca',
          barcode: '7750000000011',
          description: 'Azúcar refinada para consumo diario',
          presentationId: 4,
        },
        {
          name: 'Arroz Extra',
          barcode: '7750000000012',
          description: 'Arroz de grano largo',
          presentationId: 6,
        },
        {
          name: 'Aceite Vegetal',
          barcode: '7750000000013',
          description: 'Aceite vegetal comestible',
          presentationId: 11,
        },
      ]);
    }
  }
}
