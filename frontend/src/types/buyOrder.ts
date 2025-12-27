import type { Product } from './product';
import type { Store } from './store';
import type { Supplier } from './supplier';

export interface BuyOrderDetail {
  buyOrderId: number;
  productId: number;
  buyOrder?: BuyOrder;
  product?: Product;
  quantity: number;
  unitCost: number;
}

export interface BuyOrder {
  id: number;
  status: string;
  storeId?: number;
  store?: Store;
  supplierId?: number;
  supplier?: Supplier;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
