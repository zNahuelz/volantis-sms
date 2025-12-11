import type { Ability } from './ability';
import type { Role } from './role';
import type { Store } from './store';

export interface User {
  id?: number;
  names?: string;
  surnames?: string;
  dni?: string;
  username?: string;
  email?: string;
  profilePicture?: string | null;
  roleId?: number;
  storeId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  store?: Store | null;
  role?: Role | null;
  token?: { abilities?: Ability[] | null };
}
