import { AppDescription, DashboardText, DefaultWelcomeMessage } from '~/constants/strings';
import { useState, useEffect } from 'react';
import { formatAsDatetime, hasAbilities } from '~/utils/helpers';
import dayjs from 'dayjs';
import { useAuth } from '~/context/authContext';
import appIcon from '../../../assets/images/volLogoFullTransparent.png';
import HomeReports from '../components/HomeReports';

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
    <div>
      {!hasAbilities(auth.abilityKeys, ['sys:admin', 'report:sales']) && (
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
          {!hasAbilities(auth.abilityKeys, ['sys:admin', 'report:sales']) && (
            <h1 className='text-lg font-semibold'>{DefaultWelcomeMessage(auth.user)}</h1>
          )}
        </div>
      )}
      {hasAbilities(auth.abilityKeys, ['sys:admin', 'report:sales']) && (
        <div className='md:m-5 md:flex md:flex-col md:items-center'>
          <div className='border-accent border w-full'>
            <div className='bg-linear-to-r from-accent to-accent/70 text-white font-bold text-center md:text-start'>
              <h1 className='p-1 md:ms-3'>
                {DashboardText} - {clockString}
              </h1>
            </div>
            <div className='p-4'>
              <HomeReports />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
