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

export interface SupplierResponse {
  data: Supplier[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const supplierService = {
  list: (query: SupplierQuery): Promise<SupplierResponse> => {
    const params = new URLSearchParams();

    if (query.search) params.append('Search', query.search);
    if (query.field) params.append('Field', query.field);
    if (query.status) params.append('Status', query.status);
    if (query.sortBy) params.append('SortBy', query.sortBy);
    if (query.sortDir) params.append('SortDir', query.sortDir);
    params.append('Page', String(query.page ?? 1));
    params.append('Limit', String(query.limit ?? 10));

    return http.get(`suppliers?${params.toString()}`).json<SupplierResponse>();
  },
};
