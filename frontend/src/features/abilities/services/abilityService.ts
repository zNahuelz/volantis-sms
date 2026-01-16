import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { Ability } from '~/types/ability';

export interface AbilityMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface AbilityQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AbilityResponse {
  data: Ability[];
  meta: AbilityMeta;
}

class AbilityService extends BaseService<Ability, AbilityQuery, AbilityResponse> {
  constructor() {
    super(http, 'ability', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }

  list(status?: 'available' | 'all') {
    return http.get(`ability/index/all?status=${status}`).json<Ability[]>();
  }
}

export const abilityService = new AbilityService();
