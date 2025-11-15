import { clsx } from 'clsx';
import { Icon as IconifyIcon } from '@iconify/react';
import type { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  label?: string;
  color?: string;
  isLoading?: boolean;
  width?: string;
  icon?: string;
}

export default function Button({
  label,
  color = 'btn-primary',
  type = 'button',
  disabled = false,
  icon,
  isLoading = false,
  width = 'w-auto',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={clsx(
        'btn flex items-center gap-2 transition-all duration-150',
        color,
        width,
        {
          'cursor-not-allowed': disabled || isLoading,
        },
        className,
      )}
      {...props}
    >
      {isLoading && <span className="loading loading-dots loading-sm" />}
      {icon && <IconifyIcon icon={icon} className="h-5 w-5" />}
      {label && <span>{label}</span>}
    </button>
  );
}
