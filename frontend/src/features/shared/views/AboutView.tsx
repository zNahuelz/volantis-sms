import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useAuth } from '~/context/authContext';
import { formatAsDatetime } from '~/utils/helpers';
import appIcon from '../../../assets/images/volLogoFullTransparent.png';
import { AppDescription, AppVersion, UserInfoText } from '~/constants/strings';

export default function AboutView() {
  const [clockString, setClockString] = useState('');
  const auth = useAuth();

  useEffect(() => {
    const updateClock = () => {
      const now = dayjs();
      setClockString(formatAsDatetime(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <img
        alt='Volantis Logo'
        src={appIcon}
        className='w-60 m-3'
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      <h1 className='text-2xl font-light p-1'>{AppDescription}</h1>
      <h1 className='text-lg font-semibold'>{clockString}</h1>
      <h1 className='text-md font-extralight p-1 text-error'>{AppVersion}</h1>
      <h1 className='text-lg font-bold p-1'>
        <a href='https://github.com/zNahuelz' className='hover:text-primary hover:underline'>
          GitHub
        </a>
      </h1>

      <div className='divider'>{UserInfoText}</div>
      <h1 className='text-lg font-semibold p-1'>
        USUARIO: {auth.user?.username} - ROL: {auth.user?.role?.name}
      </h1>
      <h1 className='text-lg font-semibold p-1'>
        FECHA DE REGISTRO: {formatAsDatetime(auth.user?.createdAt) ?? 'N/A'}
      </h1>
      <h1 className='text-lg font-semibold p-1 break-all'>TOKEN: {auth.token}</h1>
      <h1 className='text-lg font-semibold p-1'>PERMISOS:</h1>
      {JSON.stringify(auth.abilityKeys)}
    </div>
  );
}
