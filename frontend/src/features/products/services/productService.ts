import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { Product } from '~/types/product';

export interface ProductMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface ProductQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  data: Product[];
  meta: ProductMeta;
}

class ProductService extends BaseService<Product, ProductQuery, ProductResponse> {
  constructor() {
    super(http, 'product', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }

  generateRandomBarcode() {
    return http.get(`product/random-barcode`).json<{ message: string; barcode: string }>();
  }

  showByBarcode(barcode: string) {
    return http.get(`product/show/${barcode}`).json<Product>();
  }
}

export const productService = new ProductService();
