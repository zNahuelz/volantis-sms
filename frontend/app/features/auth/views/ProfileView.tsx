import { useEffect, useState } from 'react';
import ProfileDetail from '../components/ProfileDetail';
import ChangeEmailForm from '../components/ChangeEmailForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ChangeAvatarForm from '../components/ChangeAvatarForm';
import type { Route } from '.react-router/types/app/+types/root';
import {
  ClosingSessionText,
  PleaseWaitText,
  ProfileAreaText,
  UpdatePasswordAlertText,
} from '~/constants/strings';
import Loading from '~/components/Loading';
import { profileService } from '../services/authService';
import { authStore, useAuth } from '~/context/authContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import Alert from '~/components/Alert';

export function meta({}: Route.MetaArgs) {
  return [{ title: ProfileAreaText }];
}

export default function ProfileView() {
  const [selected, setSelected] = useState<'profile' | 'email' | 'password' | 'avatar' | 'loading'>(
    'loading'
  );
  const [isLocked, setIsLocked] = useState(false);
  const { refreshUser } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLocked(true);
        setSelected('loading');

        const freshUser = await profileService();
        refreshUser(freshUser, freshUser.role?.abilities ?? []);

        setSelected('profile');
      } catch (err) {
        Swal.fire({
          title: ClosingSessionText,
          text: PleaseWaitText,
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading(),
        });
        await logout();
        Swal.close();
        navigate('/');
      } finally {
        setIsLocked(false);
      }
    };
    loadProfile();
  }, []);

  const menuItems = [
    { key: 'profile', label: 'Mi perfil' },
    { key: 'email', label: 'Cambiar correo electrónico' },
    { key: 'password', label: 'Cambiar contraseña' },
    { key: 'avatar', label: 'Cambiar avatar' },
  ] as const;

  return (
    <div>
      <div className='border border-primary'>
        <div className='bg-linear-to-r from-primary to-primary/60 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-4'>Configuración de Cuenta</h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[250px_1fr]'>
          <div className='p-2'>
            <ul className='menu md:menu-sm gap-1 md:menu-vertical menu-horizontal'>
              {menuItems.map((item) => (
                <li
                  key={item.key}
                  onClick={() => {
                    if (!isLocked) setSelected(item.key);
                  }}
                  className={`cursor-pointer hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors
                            ${selected === item.key ? 'bg-primary/40 font-semibold' : ''}
                            ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className='p-4 flex flex-col items-center'>
            {selected === 'profile' && (
              <ProfileDetail
                onBusyStart={() => setIsLocked(true)}
                onBusyEnd={() => setIsLocked(false)}
              />
            )}

            {selected === 'email' && (
              <ChangeEmailForm
                onBusyStart={() => setIsLocked(true)}
                onBusyEnd={() => setIsLocked(false)}
              />
            )}

            {selected === 'password' && (
              <div className='max-w-[600px] w-full'>
                <Alert message={UpdatePasswordAlertText} type='warning' variant='none'></Alert>
                <ChangePasswordForm
                  onBusyStart={() => setIsLocked(true)}
                  onBusyEnd={() => setIsLocked(false)}
                />
              </div>
            )}

            {selected === 'avatar' && (
              <ChangeAvatarForm
                onBusyStart={() => setIsLocked(true)}
                onBusyEnd={() => setIsLocked(false)}
              />
            )}

            {selected === 'loading' && <Loading loadMessage='Cargando perfil...'></Loading>}
          </div>
        </div>
      </div>
    </div>
  );
}
