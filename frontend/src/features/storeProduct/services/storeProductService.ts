import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
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
  data: StoreProduct[];
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
  Show(storeId: number | string, productId: number | string) {
    return http.get(`store-product/${storeId}/${productId}`).json<StoreProduct>();
  }
  Update(storeId: number, productId: number, payload: Partial<StoreProduct>) {
    return http
      .put(`store-product/${storeId}/${productId}`, { json: payload })
      .json<StoreProduct>();
  }
}

export const storeProductService = new StoreProductService();
