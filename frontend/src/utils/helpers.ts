import dayjs from 'dayjs';
import localeEs from 'dayjs/locale/es';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.locale(localeEs);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');
dayjs.tz.setDefault('America/Lima');
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { SaleReport } from '~/features/reports/services/reportService';

export function isInteger(value: unknown): value is number | string {
  if (typeof value === 'number') return Number.isInteger(value);
  if (typeof value === 'string' && value.trim() !== '') {
    return Number.isInteger(Number(value));
  }
  return false;
}

export function formatAsDatetime(date: string | any) {
  return date ? dayjs(date).format('DD/MM/YYYY hh:mm A') : '';
}

export function formatAsDate(date: string | any) {
  return date ? dayjs(date).format('DD/MM/YYYY') : '';
}

export function formatAsTime(time: string | any) {
  dayjs.extend(customParseFormat);
  return time ? dayjs(time, 'HH:mm:ss').format('hh:mm A') : '';
}

export function formatTwoDecimals(val: number): string {
  try {
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  } catch {
    return val.toString();
  }
}

export function sunatRound(val: number): number {
  try {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  } catch {
    return val;
  }
}

export function generateSerie(number, type) {
  if (!Number.isInteger(number) || number < 1 || number > 999) {
    throw new Error('El número debe ser entero entre 1 y 999');
  }

  const prefix = type === 'BOL' ? 'B' : type === 'FACT' ? 'F' : null;
  if (!prefix) {
    throw new Error('El tipo debe ser BOLETA o FACTURA.');
  }

  const formattedNumber = String(number).padStart(3, '0');
  return `${prefix}${formattedNumber}`;
}

export function resolveReportType(type: string) {
  switch (type.toLowerCase()) {
    case 'by_day':
      return 'Diario';
    case 'by_week':
      return 'Semanal';
    case 'by_month':
      return 'Mensual';
    case 'by_year':
      return 'Anual';
    default:
      return '';
  }
}

export function formatReportDate(type: string, date: string): string {
  const d = dayjs(date);

  if (!d.isValid()) return '';

  switch (type.toLowerCase()) {
    case 'by_day':
      return d.format('DD/MM/YYYY');

    case 'by_week':
      return `Semana del ${d.startOf('week').format('DD/MM/YYYY')}`;

    case 'by_month':
      return d.format('MMMM YYYY');

    case 'by_year':
      return d.format('YYYY');

    default:
      return '';
  }
}

export function buildSalesChart(report: SaleReport) {
  return {
    paymentChart: {
      labels: ['Efectivo', 'Tarjeta', 'Yape', 'Plin', 'Tunki'],
      data: [report.paidCash, report.paidCard, report.paidYape, report.paidPlin, report.paidTunki],
    },

    voucherChart: {
      labels: ['Boleta', 'Factura'],
      data: [report.boleta, report.factura],
    },

    averagesChart: {
      labels: ['Total', 'IGV', 'Subtotal', 'Cambio'],
      data: [
        Number(report.averageSale),
        Number(report.averageIgv),
        Number(report.averageSubtotal),
        Number(report.averageChange),
      ],
    },
  };
}
