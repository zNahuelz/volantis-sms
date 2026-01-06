import type { Product } from './product';
import type { Store } from './store';

export interface StoreProduct {
  storeId: number;
  productId: number;
  buyPrice: number;
  sellPrice: number;
  igv: number;
  profit: number;
  stock: number;
  salable: boolean;
  store?: Store;
  product?: Product;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
