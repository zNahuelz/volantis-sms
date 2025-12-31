import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { BuyOrder } from '~/types/buyOrder';

export interface BuyOrderMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface BuyOrderQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BuyOrderResponse {
  data: BuyOrder[];
  meta: BuyOrderMeta;
}

class BuyOrderService extends BaseService<BuyOrder, BuyOrderQuery, BuyOrderResponse> {
  constructor() {
    super(http, 'buy-order', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }
}

export const buyOrderService = new BuyOrderService();
