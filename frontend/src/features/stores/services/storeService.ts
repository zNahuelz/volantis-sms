import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { Store } from '~/types/store';

export interface StoreMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface StoreQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface StoreResponse {
  data: Store[];
  meta: StoreMeta;
}

class StoreService extends BaseService<Store, StoreQuery, StoreResponse> {
  constructor() {
    super(http, 'store', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }

  list() {
    return http.get(`store/index/all`).json<Store[]>();
  }
}

export const storeService = new StoreService();
