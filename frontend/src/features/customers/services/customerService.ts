import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { Customer } from '~/types/customer';

export interface CustomerMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface CustomerQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CustomerResponse {
  data: Customer[];
  meta: CustomerMeta;
}

class CustomerService extends BaseService<Customer, CustomerQuery, CustomerResponse> {
  constructor() {
    super(http, 'customer', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }
  showByDni(dni: string) {
    return http.get(`customer/dni/${dni}`).json<Customer>();
  }
}

export const customerService = new CustomerService();
