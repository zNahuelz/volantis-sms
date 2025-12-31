import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { Supplier } from '~/types/supplier';

export interface SupplierMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface SupplierQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SupplierResponse {
  data: Supplier[];
  meta: SupplierMeta;
}

class SupplierService extends BaseService<Supplier, SupplierQuery, SupplierResponse> {
  constructor() {
    super(http, 'supplier', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }
  list(status?: 'available' | 'all') {
    return http.get(`supplier/index/all?status=${status}`).json<Supplier[]>();
  }
}

export const supplierService = new SupplierService();
