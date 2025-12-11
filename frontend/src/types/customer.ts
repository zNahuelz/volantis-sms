export interface Customer {
  id: number;
  names: string;
  surnames: string;
  address?: string | null;
  phone: string;
  email: string;
  dni: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
