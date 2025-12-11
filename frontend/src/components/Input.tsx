import { clsx } from 'clsx';
import { Icon as IconifyIcon } from '@iconify/react';
import type { ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  icon?: string;
  width?: string;
  error?: boolean;
  errorMessage?: string;
}

export default function Input({
  icon,
  width = 'w-auto',
  className,
  error = false,
  errorMessage,
  ...props
}: InputProps) {
  return (
    <div className={clsx(width)}>
      <label
        className={clsx(
          'input input-bordered flex items-center gap-2',
          { 'input-error': error },
          className,
          width
        )}
      >
        {icon && <IconifyIcon icon={icon} className='text-xl opacity-50' />}
        <input {...props} className={clsx('grow bg-transparent outline-none')} />
      </label>
      {errorMessage && <span className='text-error text-sm'>{errorMessage}</span>}
    </div>
  );
}
