import type { VoucherSerie } from './voucherSerie';

export interface VoucherType {
  id?: number;
  name: string;
  voucherSeries?: VoucherSerie[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
