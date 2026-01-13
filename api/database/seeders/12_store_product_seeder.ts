import { BaseSeeder } from '@adonisjs/lucid/seeders';
import StoreProduct from '../../app/models/store_product.js';
import Product from '../../app/models/product.js';

const IGV_RATE = 0.18;
const IGV_ENABLED = true;

function calculateIgvAndProfit(buyPrice: number, sellPrice: number) {
  let igv = 0;
  let profit = 0;

  if (IGV_ENABLED) {
    const base = sellPrice / (1 + IGV_RATE);

    igv = Number((sellPrice - base).toFixed(2));
    profit = Number((base - buyPrice).toFixed(2));

    if (profit < 0) profit = 0;
  } else {
    igv = 0;
    profit = Number((sellPrice - buyPrice).toFixed(2));
    if (profit < 0) profit = 0;
  }

  return { igv, profit };
}

export default class extends BaseSeeder {
  async run() {
    const hasRecords = await StoreProduct.query().first();
    if (hasRecords) {
      return;
    }

    const products = await Product.all();

    const storeProducts: any[] = [];

    for (const product of products) {
      const buyPrice = Number((Math.random() * 20 + 2).toFixed(2)); // 2.00 – 22.00
      const sellPrice = Number((buyPrice * (1.3 + Math.random() * 0.4)).toFixed(2)); // 30%–70% margin

      const { igv, profit } = calculateIgvAndProfit(buyPrice, sellPrice);

      for (const storeId of [1, 2]) {
        storeProducts.push({
          storeId,
          productId: product.id,
          buyPrice,
          sellPrice,
          igv,
          profit,
          stock: Math.floor(Math.random() * 150) + 1,
          salable: true,
        });
      }
    }

    await StoreProduct.createMany(storeProducts);
  }
}
