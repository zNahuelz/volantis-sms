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
  VoucherIcon,
} from '~/constants/iconNames';
import {
  AboutSysText,
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
  ReportsText,
  SalesText,
  SettingText,
  StoresText,
  SuppliersText,
  SystemAbilitiesText,
  SystemPaymentTypes,
  SystemRolesText,
  SystemText,
  SystemUsersText,
  SystemVoucherSeries,
  SystemVoucherTypes,
  VouchersAltText,
} from '~/constants/strings';
import { useAuth } from '~/context/authContext';
import appIcon from '../assets/images/volLogoTransparent.png';
import { hasAbilities } from '~/utils/helpers';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const authStore = useAuth();

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

          <li
            className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'sale:store']) ? 'hidden' : ''}`}
          >
            <NavLink
              to='/dashboard/sale/create'
              className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'
            >
              <Icon icon={SaleIcon} className='text-lg leading-none'></Icon>
              <span className='font-medium'>{NewSaleText}</span>
            </NavLink>
          </li>

          <li
            className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'customer:index', 'customer:store', 'customer:update', 'customer:destroy']) ? 'hidden' : ''}`}
          >
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={CustomerIcon} className='text-lg leading-none' />
                <span className='font-medium'>{CustomersText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'customer:store']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/customer/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'customer:index']) ? 'hidden' : ''}`}
                >
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

          <li
            className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'product:index', 'product:store', 'product:update', 'product:destroy']) ? 'hidden' : ''}`}
          >
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={ProductIcon} className='text-lg leading-none' />
                <span className='font-medium'>{ProductsText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'product:store']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/product/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'storeProduct:store']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/store-product/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {AssignText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'product:index']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/product'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {ListText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'storeProduct:index']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/store-product'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {ListText} - {AssignmentsText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'presentation:index', 'presentation:store', 'presentation:update', 'presentation:destroy']) ? 'hidden' : ''}`}
                >
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

          <li
            className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'supplier:index', 'supplier:store', 'supplier:update', 'supplier:destroy']) ? 'hidden' : ''}`}
          >
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={SupplierIcon} className='text-lg leading-none' />
                <span className='font-medium'>{SuppliersText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'supplier:store']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/supplier/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'supplier:index']) ? 'hidden' : ''}`}
                >
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

          <li
            className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'buyOrder:index', 'buyOrder:store', 'buyOrder:update', 'buyOrder:destroy']) ? 'hidden' : ''}`}
          >
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={BuyOrderIcon} className='text-lg leading-none' />
                <span className='font-medium'>{BuyOrdersText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'buyOrder:store']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/buy-order/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'buyOrder:index']) ? 'hidden' : ''}`}
                >
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

          <li
            className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'sale:index', 'sale:store', 'sale:update', 'sale:destroy']) ? 'hidden' : ''}`}
          >
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={VoucherIcon} className='text-lg leading-none' />
                <span className='font-medium'>{SalesText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'sale:store']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/sale/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewSaleText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'sale:index']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/sale'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {`${ListText} - ${VouchersAltText}`}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'report:sales']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/sale/report'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {ReportsText}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li
            className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'store:index', 'store:store', 'store:update', 'store:destroy']) ? 'hidden' : ''}`}
          >
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={StoreIcon} className='text-lg leading-none' />
                <span className='font-medium'>{StoresText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'store:store']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/store/create'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {NewText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'store:index']) ? 'hidden' : ''}`}
                >
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

          <li
            className={`${
              !hasAbilities(authStore?.abilityKeys, [
                'sys:admin',
                'user:index',
                'user:store',
                'user:update',
                'user:destroy',
                'role:index',
                'role:store',
                'role:update',
                'role:destroy',
                'ability:index',
                'ability:store',
                'ability:update',
                'ability:destroy',
                'voucherSerie:index',
                'voucherSerie:store',
                'voucherSerie:update',
                'voucherSerie:destroy',
                'voucherType:index',
                'voucherType:store',
                'voucherType:update',
                'voucherType:destroy',
                'paymentType:index',
                'paymentType:store',
                'paymentType:update',
                'paymentType:destroy',
              ])
                ? 'hidden'
                : ''
            }`}
          >
            <details>
              <summary className='hover:bg-primary/50 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'>
                <Icon icon={SystemIcon} className='text-lg leading-none' />
                <span className='font-medium'>{SystemText}</span>
              </summary>
              <ul className='mt-2 ml-6 space-y-1'>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'user:index', 'user:store', 'user:update', 'user:destroy']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/user'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {SystemUsersText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'role:index', 'role:store', 'role:update', 'role:destroy']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/role'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {SystemRolesText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'ability:index', 'ability:store', 'ability:update', 'ability:destroy']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/ability'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {SystemAbilitiesText}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'voucherSerie:index', 'voucherSerie:store', 'voucherSerie:update', 'voucherSerie:destroy']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/voucher-serie'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {SystemVoucherSeries}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'paymentType:index', 'paymentType:store', 'paymentType:update', 'paymentType:destroy']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/payment-type'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {SystemPaymentTypes}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'voucherType:index', 'voucherType:store', 'voucherType:update', 'voucherType:destroy']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/voucher-type'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {SystemVoucherTypes}
                  </NavLink>
                </li>
                <li
                  className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'sys:info']) ? 'hidden' : ''}`}
                >
                  <NavLink
                    to='/dashboard/about'
                    className='hover:bg-primary/50 block rounded px-3 py-1'
                  >
                    {AboutSysText}
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li
            className={`${!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'setting:index', 'setting:store', 'setting:update', 'setting:destroy']) ? 'hidden' : ''}`}
          >
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
