export interface Store {
  id?: number;
  name?: string;
  ruc?: string;
  address?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
