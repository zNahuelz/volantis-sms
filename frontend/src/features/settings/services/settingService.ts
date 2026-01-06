import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { Setting } from '~/types/setting';

export interface SettingMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface SettingQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SettingResponse {
  data: Setting[];
  meta: SettingMeta;
}

class SettingService extends BaseService<Setting, SettingQuery, SettingResponse> {
  constructor() {
    super(http, 'setting', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }
  showByKey(key: string) {
    return http.get(`setting/key/${key}`).json<Setting>();
  }
}

export const settingService = new SettingService();
