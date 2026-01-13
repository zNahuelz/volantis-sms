import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { VoucherSerie } from '~/types/voucherSerie';

export interface VoucherSerieMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface VoucherSerieQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface VoucherSerieResponse {
  data: VoucherSerie[];
  meta: VoucherSerieMeta;
}

class VoucherSerieService extends BaseService<
  VoucherSerie,
  VoucherSerieQuery,
  VoucherSerieResponse
> {
  constructor() {
    super(http, 'voucher-serie', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }

  list(status?: 'available' | 'all') {
    return http.get(`voucher-serie/index/all?status=${status}`).json<VoucherSerie[]>();
  }
}

export const voucherSerieService = new VoucherSerieService();
