import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { Product } from '~/types/product';
import type { StoreProduct } from '~/types/storeProduct';

export interface StoreProductMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface StoreProductQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface StoreProductResponse {
  data: Product[];
  meta: StoreProductMeta;
}

class StoreProductService extends BaseService<
  StoreProduct,
  StoreProductQuery,
  StoreProductResponse
> {
  constructor() {
    super(http, 'store-product', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }
}

export const storeProductService = new StoreProductService();
