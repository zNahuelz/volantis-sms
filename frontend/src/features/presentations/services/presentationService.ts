import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { Presentation } from '~/types/presentation';

export interface PresentationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface PresentationQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PresentationResponse {
  data: Presentation[];
  meta: PresentationMeta;
}

class PresentationService extends BaseService<
  Presentation,
  PresentationQuery,
  PresentationResponse
> {
  constructor() {
    super(http, 'presentation', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }
}

export const presentationService = new PresentationService();
