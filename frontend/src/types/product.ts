import type { Presentation } from './presentation';

export interface Product {
  id?: number;
  name: string;
  barcode: string;
  description: string;
  presentationId?: number;
  presentation: Presentation;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
