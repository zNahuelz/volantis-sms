import { http } from '~/api/httpWrapper';
import type { Supplier } from '~/types/supplier';

export interface SupplierQuery {
  search?: string;
  field?: string;
  status?: 'enabled' | 'disabled';
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SupplierMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface SupplierResponse {
  data: Supplier[];
  meta: SupplierMeta;
}

export interface SupplierCreateRequest {
  name: string;
  ruc: string;
  phone: string;
  email: string;
  address: string;
}

export const supplierService = {
  create: (payload: SupplierCreateRequest) => http.post('supplier', { json: payload }).json(),
  show: (id: number) => http.get(`supplier/${id}`).json<Supplier>(),
  index: (query: SupplierQuery): Promise<SupplierResponse> => {
    const params = new URLSearchParams();

    if (query.search) params.append('search', query.search);
    if (query.field) params.append('searchBy', query.field);
    if (query.status) params.append('status', query.status);
    if (query.sortBy) params.append('orderBy', query.sortBy);
    if (query.sortDir) params.append('orderDir', query.sortDir);

    params.append('page', String(query.page ?? 1));
    params.append('limit', String(query.limit ?? 10));

    return http.get(`supplier?${params.toString()}`).json<SupplierResponse>();
  },

  update: (id: number, payload: SupplierCreateRequest) =>
    http.put(`supplier/${id}`, { json: payload }).json(),
};
