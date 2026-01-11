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
  showByProductId(productId: number | string) {
    return http.get(`store-product/product-id/${productId}`).json<StoreProduct[]>();
  }
  showByBarcode(barcode: string, storeId: number | string) {
    return http.get(`store-product/barcode/${barcode}/${storeId}`).json<StoreProduct>();
  }
  Update(storeId: number | string, productId: number | string, payload: Partial<StoreProduct>) {
    return http
      .put(`store-product/${storeId}/${productId}`, { json: payload })
      .json<StoreProduct>();
  }
  Destroy(storeId: number | string, productId: number | string) {
    return http.delete(`store-product/${storeId}/${productId}`).json<any>();
  }
}

export const storeProductService = new StoreProductService();
