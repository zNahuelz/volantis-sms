import { http } from '~/api/httpWrapper';
import type { Sale } from '~/types/sale';

export type SaleReport = {
  reportType: string;
  date: Date;
  totalSales: number;
  highestSale: Sale;
  lowestSale: Sale;
  paidCash: number;
  paidCard: number;
  paidYape: number;
  paidPlin: number;
  paidTunki: number;
  boleta: number;
  factura: number;
  averageSale: number;
  averageIgv: number;
  averageSubtotal: number;
  averageChange: number;
};

class ReportService {
  salesReport(type: 'by_day' | 'by_week' | 'by_month' | 'by_year', date: Date | string) {
    return http.get(`report/sales/?type=${type}&date=${date}`).json<SaleReport>();
  }
}

export const reportService = new ReportService();
