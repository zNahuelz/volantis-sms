import { clsx } from 'clsx';
import type { ComponentProps } from 'react';

interface FileInputProps extends ComponentProps<'input'> {
  width?: string;
  error?: boolean;
  errorMessage?: string;
}

export default function FileInput({
  width = 'w-auto',
  className,
  error = false,
  errorMessage,
  ...props
}: FileInputProps) {
  return (
    <div className={clsx(width)}>
      <label
        className={clsx(
          'file-input file-input-bordered',
          { 'file-input-error': error },
          className,
          width
        )}
      >
        <input {...props} type='file' className={clsx('bg-transparent outline-none')} />
      </label>

      {errorMessage && <span className='text-error text-sm'>{errorMessage}</span>}
    </div>
  );
}
