import { Icon } from '@iconify/react';
import React from 'react';
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '~/constants/iconNames';

type AlertType = 'info' | 'success' | 'warning' | 'error';
type AlertVariant = 'soft' | 'outline' | 'dash' | 'none';

interface AlertProps {
  type?: AlertType;
  variant?: AlertVariant;
  message: string;
  width?: string;
  className?: string;
}

const typeConfig: Record<AlertType, { icon: string; className: string }> = {
  info: {
    icon: InfoIcon,
    className: 'alert-info',
  },
  success: {
    icon: SuccessIcon,
    className: 'alert-success',
  },
  warning: {
    icon: WarningIcon,
    className: 'alert-warning',
  },
  error: {
    icon: ErrorIcon,
    className: 'alert-error',
  },
};

const variantClasses: Record<AlertVariant, string> = {
  soft: 'alert-soft',
  outline: 'alert-outline',
  dash: 'alert-dash',
  none: '',
};

export default function Alert({
  type = 'info',
  variant = 'soft',
  message,
  width = 'w-full',
  className = '',
}: AlertProps) {
  const config = typeConfig[type];
  const variantClass = variantClasses[variant];

  return (
    <div role='alert' className={`alert ${config.className} ${variantClass} ${width} ${className}`}>
      <Icon icon={config.icon} className='h-5 w-5 shrink-0' />
      <span>{message}</span>
    </div>
  );
}
