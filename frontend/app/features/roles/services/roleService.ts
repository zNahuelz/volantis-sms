import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { Role } from '~/types/role';

export interface RoleMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface RoleQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface RoleResponse {
  data: Role[];
  meta: RoleMeta;
}

class RoleService extends BaseService<Role, RoleQuery, RoleResponse> {
  constructor() {
    super(http, 'role', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }

  list() {
    return http.get(`role/index/all`).json<Role[]>();
  }
}

export const roleService = new RoleService();
