import { Icon } from '@iconify/react';
import { NavLink } from 'react-router';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import {
  BuyOrderIcon,
  CustomerIcon,
  HomeIcon,
  LogoutIcon,
  ProductIcon,
  SaleIcon,
  SettingsIcon,
  StoreIcon,
  SupplierIcon,
  SystemIcon,
} from '~/constants/iconNames';
import {
  AppDescription,
  AppName,
  AssignText,
  AssignmentsText,
  BuyOrdersText,
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
  StoresText,
  SuppliersText,
  SystemAbilitiesText,
  SystemPaymentTypes,
  SystemRolesText,
  SystemText,
  SystemUsersText,
} from '~/constants/strings';
import { useAuth } from '~/context/authContext';
import appIcon from '../assets/images/volLogoTransparent.png';

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
          <div className='flex flex-col items-center'>
            <img
              alt={AppName}
              src={appIcon}
              className='w-10 my-1 text-center'
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
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
            <NavLink
              to='/dashboard/sale/create'
              className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'
            >
              <Icon icon={SaleIcon} className='text-lg leading-none'></Icon>
              <span className='font-medium'>{NewSaleText}</span>
            </NavLink>
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
                    to='/dashboard/store-product/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {AssignText}
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
                    to='/dashboard/store-product'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {ListText} - {AssignmentsText}
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
                <Icon icon={BuyOrderIcon} className='text-lg leading-none' />
                <span className='font-medium'>{BuyOrdersText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li>
                  <NavLink
                    to='/dashboard/buy-order/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewText}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/dashboard/buy-order'
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
                <Icon icon={StoreIcon} className='text-lg leading-none' />
                <span className='font-medium'>{StoresText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li>
                  <NavLink
                    to='/dashboard/store/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewText}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/dashboard/store'
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
                <li>
                  <NavLink
                    to='/dashboard/payment-type'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {SystemPaymentTypes}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <NavLink
              to='/dashboard/settings'
              className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'
            >
              <Icon icon={SettingsIcon} className='text-lg leading-none'></Icon>
              <span className='font-medium'>{SettingText}</span>
            </NavLink>
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
