import { Icon } from '@iconify/react';
import { PAGINATION_LIMITS } from '~/constants/arrays';
import { ArrowLeftIcon, ArrowRightIcon } from '~/constants/iconNames';

type PaginatorProps = {
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limits?: { label: string; value: number }[];
  status: string;
  onStatusChange: (status: string) => void;
  statusTypes?: { label: string; value: string }[];
};

export function Paginator({
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
  limits = PAGINATION_LIMITS,
  status,
  onStatusChange,
  statusTypes = [],
}: PaginatorProps) {
  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages && p !== page) onPageChange(p);
  };

  return (
    <div className='mt-3 flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0 w-full md:w-auto'>
      <div className='flex flex-col items-center space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-3 w-full md:w-auto'>
        <div className='join'>
          <button className='btn join-item' disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            <Icon icon={ArrowLeftIcon} />
          </button>

          <button
            className={`btn join-item ${page === 1 ? 'btn-active' : ''}`}
            onClick={() => goToPage(1)}
          >
            1
          </button>

          {totalPages > 2 && <button className='btn join-item btn-disabled'>...</button>}

          {totalPages > 1 && (
            <button
              className={`btn join-item ${page === totalPages ? 'btn-active' : ''}`}
              onClick={() => goToPage(totalPages)}
            >
              {totalPages}
            </button>
          )}

          <button
            className='btn join-item'
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            <Icon icon={ArrowRightIcon} />
          </button>
        </div>

        <select
          className='select md:w-50 w-full'
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {limits.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <select
        className='select md:w-50 w-full'
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        {statusTypes.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
