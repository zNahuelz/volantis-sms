import { http } from '~/api/httpWrapper';
import { BaseService } from '~/services/baseService';
import type { User } from '~/types/user';

export interface UserMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface UserQuery {
  search?: string;
  field?: string;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserResponse {
  data: User[];
  meta: UserMeta;
}

class UserService extends BaseService<User, UserQuery, UserResponse> {
  constructor() {
    super(http, 'user', {
      field: 'searchBy',
      sortBy: 'orderBy',
      sortDir: 'orderDir',
    });
  }
}

export const userService = new UserService();
