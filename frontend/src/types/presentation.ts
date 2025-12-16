export interface Presentation {
  id?: number;
  name: string;
  description?: string;
  numericValue: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
