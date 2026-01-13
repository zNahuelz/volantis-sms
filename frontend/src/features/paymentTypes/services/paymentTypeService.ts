import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { PaymentType } from '~/types/paymentType';

export interface PaymentTypeMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface PaymentTypeQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaymentTypeResponse {
  data: PaymentType[];
  meta: PaymentTypeMeta;
}

class PaymentTypeService extends BaseService<PaymentType, PaymentTypeQuery, PaymentTypeResponse> {
  constructor() {
    super(http, 'payment-type', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }

  list(status?: 'available' | 'all') {
    return http.get(`payment-type/index/all?status=${status}`).json<PaymentType[]>();
  }
}

export const paymentTypeService = new PaymentTypeService();
