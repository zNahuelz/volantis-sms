import type { Ability } from './ability';

export interface Role {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  abilities?: Ability[] | null;
}
