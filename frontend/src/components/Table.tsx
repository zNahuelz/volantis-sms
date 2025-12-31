import clsx from 'clsx';
import React from 'react';
import { ActionsText, EmptyListText, IsActiveText, IsDeletedText } from '~/constants/strings';
import { formatAsDatetime } from '~/utils/helpers';
const RIGHT_ALIGNED_COLUMNS = ['total', 'igv', 'subtotal', 'amount', 'quantity'] as const;

export type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  errorMessage?: string;
  actions?: (row: T) => React.ReactNode;
  className?: string;
  size?: string;
  showActions?: boolean;
};

export function Table<T>({
  columns,
  data,
  errorMessage = EmptyListText,
  actions,
  className,
  size,
  showActions = true,
}: TableProps<T>) {
  return (
    <div
      className={clsx(
        'rounded-box border-base-content/5 bg-base-100 overflow-x-auto border',
        className
      )}
    >
      <table className={clsx('table', size)}>
        <thead>
          <tr className='font-bold text-black'>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={clsx(RIGHT_ALIGNED_COLUMNS.includes(col.key as any) && 'text-end')}
              >
                {col.label}
              </th>
            ))}

            {showActions && <th className='text-center'>{ActionsText}</th>}
          </tr>
        </thead>

        <tbody>
          {(!data || data.length === 0) && (
            <tr>
              <td
                colSpan={columns.length + (showActions ? 1 : 0)}
                className='py-4 text-center text-lg font-light'
              >
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

                if (col.key === 'status') {
                  return (
                    <td
                      key={String(col.key)}
                      className={`${
                        value === 'PENDIENTE'
                          ? 'text-neutral'
                          : value === 'ENVIADO'
                            ? 'text-info'
                            : value === 'CANCELADA'
                              ? 'text-error'
                              : value === 'FINALIZADA'
                                ? 'text-success'
                                : 'text-black'
                      } font-bold`}
                    >
                      {value}
                    </td>
                  );
                }

                if (['total', 'igv', 'subtotal', 'amount', 'quantity'].includes(col.key)) {
                  return (
                    <td key={String(col.key)} className='text-end'>
                      {value}
                    </td>
                  );
                }

                return <td key={String(col.key)}>{String(value ?? '')}</td>;
              })}

              {showActions && (
                <td className='flex items-center justify-center'>{actions && actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
