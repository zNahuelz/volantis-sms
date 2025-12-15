import { Icon } from '@iconify/react';
import { NavLink } from 'react-router';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import {
  CustomerIcon,
  HomeIcon,
  LogoutIcon,
  ProductIcon,
  SaleIcon,
  SettingsIcon,
  SupplierIcon,
  SystemIcon,
} from '~/constants/iconNames';
import {
  AppDescription,
  AppName,
  ClosingSessionText,
  CustomersText,
  HomeText,
  ListText,
  LogoutText,
  NewSaleText,
  NewText,
  PleaseWaitText,
  PresentationManagementText,
  ProductsText,
  SettingText,
  SuppliersText,
  SystemAbilitiesText,
  SystemRolesText,
  SystemText,
  SystemUsersText,
} from '~/constants/strings';
import { useAuth } from '~/context/authContext';

export default function Sidebar() {
  const { logout } = useAuth();
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
    <aside className='border-base-300 bg-base-200 min-h-full w-64 border-r'>
      <div className='border-base-300 border-b p-2'>
        <div className='flex flex-col items-center gap-3'>
          <div>
            <h2 className='text-primary text-center text-lg font-bold'>{AppName}</h2>
            <p className='text-base-content/70 text-sm'>{AppDescription}</p>
          </div>
        </div>
      </div>

      <div className='p-4'>
        <ul className='menu menu-sm gap-1'>
          <li>
            <NavLink
              to='/dashboard'
              className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'
            >
              <Icon icon={HomeIcon} className='text-lg leading-none'></Icon>
              <span className='font-medium'>{HomeText}</span>
            </NavLink>
          </li>

          <li>
            <button className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
              <Icon icon={SaleIcon} className='text-lg leading-none'></Icon>
              <span className='font-medium'>{NewSaleText}</span>
            </button>
          </li>

          <li>
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={CustomerIcon} className='text-lg leading-none' />
                <span className='font-medium'>{CustomersText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li>
                  <NavLink
                    to='/dashboard/customer/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewText}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/dashboard/customer'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {ListText}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={ProductIcon} className='text-lg leading-none' />
                <span className='font-medium'>{ProductsText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li>
                  <NavLink
                    to='/dashboard/product/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewText}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/dashboard/product'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {ListText}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/dashboard/presentation'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {PresentationManagementText}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={SupplierIcon} className='text-lg leading-none' />
                <span className='font-medium'>{SuppliersText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li>
                  <NavLink
                    to='/dashboard/supplier/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewText}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/dashboard/supplier'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {ListText}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={SystemIcon} className='text-lg leading-none' />
                <span className='font-medium'>{SystemText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li>
                  <NavLink
                    to='/dashboard/user'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {SystemUsersText}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/dashboard/role'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {SystemRolesText}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/dashboard/ability'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {SystemAbilitiesText}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <button
              type='button'
              className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'
            >
              <Icon icon={SettingsIcon} className='text-lg leading-none'></Icon>
              <span className='font-medium'>{SettingText}</span>
            </button>
          </li>

          <li>
            <button
              type='button'
              onClick={handleLogout}
              className='hover:bg-error/10 hover:text-error flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'
            >
              <Icon icon={LogoutIcon} className='h-5 w-5' />
              <span className='font-medium'>{LogoutText}</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
