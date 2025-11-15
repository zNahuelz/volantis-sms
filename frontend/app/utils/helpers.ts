import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

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
