import React from 'react';
import { ActionsText, EmptyListText, IsActiveText, IsDeletedText } from '~/constants/strings';
import { formatAsDatetime } from '~/utils/helpers';

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  errorMessage?: string;
  actions?: (row: T) => React.ReactNode;
};

export function Table<T>({ columns, data, errorMessage = EmptyListText, actions }: TableProps<T>) {
  return (
    <div className='rounded-box border-base-content/5 bg-base-100 overflow-x-auto border'>
      <table className='table'>
        <thead>
          <tr className='font-bold text-black'>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
            <th className='text-center'>{ActionsText}</th>
          </tr>
        </thead>

        <tbody>
          {(!data || data.length === 0) && (
            <tr>
              <td colSpan={columns.length + 1} className='py-4 text-center text-lg font-light'>
                {errorMessage}
              </td>
            </tr>
          )}

          {data?.map((row, i) => (
            <tr key={i} className='hover:bg-secondary/10'>
              {columns.map((col) => {
                const value = row[col.key];

                if (col.render) return <td key={String(col.key)}>{col.render(row)}</td>;

                if (col.key === 'createdAt' && value)
                  return <td key={String(col.key)}>{formatAsDatetime(value)}</td>;

                if (col.key === 'updatedAt' && value)
                  return <td key={String(col.key)}>{formatAsDatetime(value)}</td>;

                if (col.key === 'deletedAt') {
                  const disabled = Boolean(value);
                  return (
                    <td
                      key={String(col.key)}
                      className={disabled ? 'text-error font-bold' : 'text-success font-bold'}
                    >
                      {disabled ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()}
                    </td>
                  );
                }

                return <td key={String(col.key)}>{String(value ?? '')}</td>;
              })}

              <td className='flex items-center justify-center'>{actions && actions(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
