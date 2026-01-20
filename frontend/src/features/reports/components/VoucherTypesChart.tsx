import { Pie } from 'react-chartjs-2';
import { VOUCHER_COLORS } from '~/constants/values';

export function VoucherTypesChart({ data }: { data: number[] }) {
  return (
    <Pie
      data={{
        labels: ['BOLETA', 'FACTURA'],
        datasets: [
          {
            data,
            backgroundColor: [VOUCHER_COLORS.BOLETA, VOUCHER_COLORS.FACTURA],
          },
        ],
      }}
    />
  );
}
