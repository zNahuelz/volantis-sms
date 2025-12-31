import { AppDescription, AppName, AppVersion, WelcomeAreaText } from '~/constants/strings';
import { useState, useEffect } from 'react';
import { formatAsDatetime } from '~/utils/helpers';
import dayjs from 'dayjs';
import { useAuth } from '~/context/authContext';
import appIcon from '../../../assets/images/volLogoFullTransparent.png';

export default function WelcomeView() {
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
      <h1 className='text-lg font-semibold p-1'>
        USUARIO: {auth.user?.username} - ROL: {auth.user?.role?.name}
      </h1>
      <h1 className='text-lg font-semibold p-1 break-all'>TOKEN: {auth.token}</h1>
      <h1 className='text-lg font-semibold p-1'>PERMISOS:</h1>
      {JSON.stringify(auth.abilityKeys)}
    </div>
  );
}
