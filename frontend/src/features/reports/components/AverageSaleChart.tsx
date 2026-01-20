import { Bar } from 'react-chartjs-2';
import { AVERAGE_COLORS } from '~/constants/values';

export function AverageSaleChart({ data }: { data: number[] }) {
  return (
    <Bar
      data={{
        labels: ['VENTA', 'IGV', 'SUBTOTAL', 'CAMBIO'],
        datasets: [
          {
            label: 'Monto Promedio (S./)',
            data,
            backgroundColor: [
              AVERAGE_COLORS.VENTA,
              AVERAGE_COLORS.IGV,
              AVERAGE_COLORS.SUBTOTAL,
              AVERAGE_COLORS.CAMBIO,
            ],
          },
        ],
      }}
      options={{
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }}
    />
  );
}
