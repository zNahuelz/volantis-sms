import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import {
  AdminIcon,
  CustomRoleIcon,
  EmptyNotificationsIcon,
  ManagerIcon,
  MenuIcon,
  SellerIcon,
  UnknownRoleIcon,
} from '~/constants/iconNames';
import { ClosingSessionText, LogoutText, PleaseWaitText, SettingText } from '~/constants/strings';
import { useAuth } from '~/context/authContext';
import defaultPfp from '../assets/images/defaultPfp.png';
import Swal from 'sweetalert2';
const API_URL = import.meta.env.VITE_API_URL;

export default function Navbar() {
  const { logout } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
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
  };
  return (
    <div className='navbar border-base-300 bg-base-100 border-b px-4 lg:px-6'>
      <div className='navbar-start'>
        <label htmlFor='drawer-toggle' className='btn btn-circle btn-ghost lg:hidden'>
          <Icon icon={MenuIcon} className='h-5 w-5' />
        </label>
      </div>

      <div className='navbar-center hidden lg:flex'></div>

      <div className='navbar-end gap-2'>
        <div className='btn btn-circle btn-ghost' title={user?.role?.name ?? 'USUARIO SIN ROL'}>
          <div className='indicator'>
            <Icon
              icon={
                user?.role?.name === 'ADMINISTRADOR'
                  ? AdminIcon
                  : user?.role?.name === 'VENDEDOR'
                    ? SellerIcon
                    : user?.role?.name === 'GERENTE'
                      ? ManagerIcon
                      : user?.role == null
                        ? UnknownRoleIcon
                        : CustomRoleIcon
              }
              className='h-5 w-5 text-info'
            />
          </div>
        </div>

        <div className='dropdown dropdown-end'>
          <div tabIndex={0} role='button' className='btn btn-circle btn-ghost'>
            <div className='indicator'>
              <Icon icon={EmptyNotificationsIcon} className='h-5 w-5' />
              <span className='indicator-item badge badge-sm badge-primary'>3</span>
            </div>
          </div>
          <div className='card-compact dropdown-content card bg-base-100 z-1 mt-3 w-80 border shadow-lg'>
            <div className='card-body'>
              <h3 className='text-lg font-bold'>Notificaciones</h3>
              <div className='space-y-2'>
                <div className='hover:bg-base-200 rounded p-2'>
                  <p className='text-sm font-medium'>Mensaje de Prueba #1</p>
                  <p className='text-base-content/70 text-xs'>Hace 5 minutos</p>
                </div>
                <div className='hover:bg-base-200 rounded p-2'>
                  <p className='text-sm font-medium'>Mensaje de Prueba #2</p>
                  <p className='text-base-content/70 text-xs'>Hace 10 minutos</p>
                </div>
                <div className='hover:bg-base-200 rounded p-2'>
                  <p className='text-sm font-medium'>Mensaje de Prueba #3</p>
                  <p className='text-base-content/70 text-xs'>Hace 1 hora</p>
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <button className='btn btn-wide btn-primary'>Ver todas</button>
              </div>
            </div>
          </div>
        </div>

        <div className='dropdown dropdown-end'>
          <div tabIndex={0} role='button' className='btn avatar btn-circle btn-ghost'>
            <div className='w-10 rounded-full'>
              <img
                alt='User Avatar'
                src={
                  user?.profilePicture != null
                    ? `${API_URL}/storage/profile-picture/${user?.profilePicture}`
                    : defaultPfp
                }
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onError={(e) => {
                  if (e.currentTarget.src !== defaultPfp) {
                    e.currentTarget.src = defaultPfp;
                  }
                }}
              />
            </div>
          </div>
          <ul className='dropdown-content menu menu-sm rounded-box bg-base-100 z-1 mt-3 w-52 p-2 shadow-lg'>
            <li>
              <button
                type='button'
                className='justify-between'
                onClick={() => {
                  navigate('/dashboard/profile');
                }}
              >
                Perfil
              </button>
            </li>
            <li>
              <button type='button'>{SettingText}</button>
            </li>
            <li>
              <button type='button' onClick={handleLogout}>
                {LogoutText}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
