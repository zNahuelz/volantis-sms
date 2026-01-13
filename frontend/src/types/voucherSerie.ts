import type { VoucherType } from './voucherType';

export interface VoucherSerie {
  id?: number;
  seriesCode: string;
  currentNumber: number;
  isActive: boolean;
  voucherTypeId?: number;
  voucherType?: VoucherType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
