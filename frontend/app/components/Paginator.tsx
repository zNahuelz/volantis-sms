import { Icon } from '@iconify/react';
import React from 'react';
import { PAGINATION_LIMITS } from '~/constants/arrays';
import { ArrowLeftIcon, ArrowRightIcon } from '~/constants/iconNames';

type PaginatorProps = {
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limits?: { label: string; value: number }[];
};

export function Paginator({
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
  limits = PAGINATION_LIMITS,
}: PaginatorProps) {
  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages && p !== page) onPageChange(p);
  };

  return (
    <div className="mt-3 flex flex-col items-center space-y-2 md:flex-row md:justify-between md:gap-2 md:space-y-0">
      <div className="join">
        <button
          className="btn join-item"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
        >
          <Icon icon={ArrowLeftIcon}></Icon>
        </button>

        <button
          className={`btn join-item ${page === 1 ? 'btn-active' : ''}`}
          onClick={() => goToPage(1)}
        >
          1
        </button>

        {totalPages > 2 && (
          <button className="btn join-item btn-disabled">...</button>
        )}

        {totalPages > 1 && (
          <button
            className={`btn join-item ${
              page === totalPages ? 'btn-active' : ''
            }`}
            onClick={() => goToPage(totalPages)}
          >
            {totalPages}
          </button>
        )}

        <button
          className="btn join-item"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
        >
          <Icon icon={ArrowRightIcon}></Icon>
        </button>
      </div>

      <select
        className="select w-60 md:w-50"
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
  );
}
