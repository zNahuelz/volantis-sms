import type { Product } from './product';
import type { Sale } from './sale';

export interface SaleDetail {
  saleId?: number;
  productId?: number;
  quantity: number;
  unitPrice: number;
  sale?: Sale;
  product?: Product;
}
