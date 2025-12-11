import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import { _404Icon } from '~/constants/iconNames';
import { _404Text } from '~/constants/strings';

export default function ViewNotFound() {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center'>
      <Icon icon={_404Icon} className='text-[150px] text-error'></Icon>
      <h1 className='text-xl font-light'>{_404Text}</h1>
      <h1 className='text-lg font-semibold'>
        Click{' '}
        <span className='font-bold hover:text-primary' onClick={() => navigate('/dashboard')}>
          aquí
        </span>{' '}
        para ir al inicio.
      </h1>
    </div>
  );
}
