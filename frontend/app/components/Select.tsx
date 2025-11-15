import { clsx } from 'clsx';
import type { ComponentProps } from 'react';

interface SelectProps extends ComponentProps<'select'> {
  width?: string;
  error?: boolean;
  errorMessage?: string;
  options: { value: string | number; label: string }[];
}

export default function Select({
  width = 'w-auto',
  className,
  error = false,
  errorMessage,
  options,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      <select
        {...props}
        className={clsx(
          'select select-bordered',
          { 'select-error': error },
          width,
          className,
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {errorMessage && (
        <span className="text-error text-sm">{errorMessage}</span>
      )}
    </div>
  );
}
