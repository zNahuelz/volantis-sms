import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { VoucherType } from '~/types/voucherType';

export interface VoucherTypeMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface VoucherTypeQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface VoucherTypeResponse {
  data: VoucherType[];
  meta: VoucherTypeMeta;
}

class VoucherTypeService extends BaseService<VoucherType, VoucherTypeQuery, VoucherTypeResponse> {
  constructor() {
    super(http, 'voucher-type', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }

  list(status?: 'available' | 'all') {
    return http.get(`voucher-type/index/all?status=${status}`).json<VoucherType[]>();
  }

  restoreTypes() {
    return http.post(`voucher-type/regenerate`).json<{ message: string }>();
  }
}

export const voucherTypeService = new VoucherTypeService();
