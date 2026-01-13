import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { Role } from '~/types/role';
import type { Sale } from '~/types/sale';

export interface SaleMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface SaleQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SaleResponse {
  data: Sale[];
  meta: SaleMeta;
}

class SaleService extends BaseService<Sale, SaleQuery, SaleResponse> {
  constructor() {
    super(http, 'sale', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }
}

export const saleService = new SaleService();
