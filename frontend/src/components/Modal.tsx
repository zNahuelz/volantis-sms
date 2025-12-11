import type { ReactNode, MouseEvent } from 'react';
import { CloseIcon } from '~/constants/iconNames';
import { Icon } from '@iconify/react';

interface ModalProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  disableClose?: boolean;
  width?: string;
  footer?: ReactNode;
  color?: string;
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  disableClose = false,
  width = 'max-w-md',
  footer,
  color = 'primary',
}: ModalProps) {
  if (!open) return null;

  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disableClose) return;
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm'
      onClick={handleBackgroundClick}
    >
      <div className={`relative bg-white rounded-lg shadow-lg w-full ${width}`}>
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>

          {!disableClose && (
            <button
              type='button'
              className='text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg  m-1 p-2'
              onClick={onClose}
            >
              <Icon icon={CloseIcon}></Icon>
            </button>
          )}
        </div>

        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
}
