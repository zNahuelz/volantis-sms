import dayjs from 'dayjs';
import localeEs from 'dayjs/locale/es.js';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.locale(localeEs);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');
dayjs.tz.setDefault('America/Lima');

export function sunatRound(val: number): number {
  try {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  } catch {
    return val;
  }
}

export function formatAsDatetime(date: string | any) {
  return date ? dayjs.utc(date).tz('America/Lima').format('DD/MM/YYYY hh:mm A') : '';
}

export function formatAsDate(date: string | any) {
  return date ? dayjs.utc(date).tz('America/Lima').format('DD/MM/YYYY') : '';
}
