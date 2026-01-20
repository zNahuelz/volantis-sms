import { Doughnut } from 'react-chartjs-2';
import { PAYMENT_COLORS } from '~/constants/values';

export function PaymentTypesChart({ data }: { data: number[] }) {
  return (
    <Doughnut
      data={{
        labels: ['Efectivo', 'Tarjeta', 'Yape', 'Plin', 'Tunki'],
        datasets: [
          {
            data,
            backgroundColor: [
              PAYMENT_COLORS.EFECTIVO,
              PAYMENT_COLORS.TARJETA,
              PAYMENT_COLORS.YAPE,
              PAYMENT_COLORS.PLIN,
              PAYMENT_COLORS.TUNKI,
            ],
          },
        ],
      }}
    />
  );
}
