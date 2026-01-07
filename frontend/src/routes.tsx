import { createBrowserRouter } from 'react-router';
import LoginView from './features/auth/views/LoginView';
import GuestRoute from './features/auth/components/GuestRoute';
import {
  AbilitiesListAreaText,
  BuyOrderDetailAreaText,
  BuyOrdersListAreaText,
  CreateBuyOrderAreaText,
  CreateCustomerAreaText,
  CreateProductAreaText,
  CreateRoleAreaText,
  CreateSupplierAreaText,
  CustomerDetailAreaText,
  CustomersListAreaText,
  EditBuyOrderAreaText,
  EditCustomerAreaText,
  EditProductAreaText,
  EditRoleAreaText,
  EditSupplierAreaText,
  LoginAreaText,
  PresentationsListAreaText,
  ProductDetailAreaText,
  ProductsListAreaText,
  ProfileAreaText,
  RoleDetailAreaText,
  RolesListAreaText,
  SettingsListAreaText,
  StoreProductCreateAreaText,
  StoreProductDetailAreaText,
  StoreProductEditAreaText,
  StoreProductsListAreaText,
  StoresListAreaText,
  SupplierDetailAreaText,
  SuppliersListAreaText,
  UserDetailAreaText,
  UsersListAreaText,
  WelcomeAreaText,
  _404AreaText,
} from './constants/strings';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import WelcomeView from './features/shared/views/WelcomeView';
import DashboardLayout from './layouts/DashboardLayout';
import ProfileView from './features/auth/views/ProfileView';
import CustomerListView from './features/customers/views/CustomersListView';
import CustomerCreateView from './features/customers/views/CustomerCreateView';
import CustomerDetailView from './features/customers/views/CustomerDetailView';
import CustomerEditView from './features/customers/views/CustomerEditView';
import SuppliersListView from './features/suppliers/views/SuppliersListView';
import SupplierCreateView from './features/suppliers/views/SupplierCreateView';
import SupplierDetailView from './features/suppliers/views/SupplierDetailView';
import SupplierEditView from './features/suppliers/views/SupplierEditView';
import UsersListView from './features/users/views/UsersListView';
import UserDetailView from './features/users/views/UserDetailView';
import { AbilityRoute } from './features/auth/components/AbilityRoute';
import ViewNotFound from './components/ViewNotFound';
import RolesListView from './features/roles/views/RolesListView';
import RoleCreateView from './features/roles/views/RoleCreateView';
import { EditRoleIcon } from './constants/iconNames';
import RoleEditView from './features/roles/views/RoleEditView';
import RoleDetailView from './features/roles/views/RoleDetailView';
import AbilitiesListView from './features/abilities/views/AbilitiesListView';
import PresentationsListView from './features/presentations/views/PresentationsListView';
import ProductsListView from './features/products/views/ProductsListView';
import ProductCreateView from './features/products/views/ProductCreateView';
import SettingsListView from './features/settings/views/SettingsListView';
import ProductEditView from './features/products/views/ProductEditView';
import ProductDetailView from './features/products/views/ProductDetailView';
import BuyOrderCreateView from './features/buyOrders/views/BuyOrderCreateView';
import BuyOrderListView from './features/buyOrders/views/BuyOrderListView';
import BuyOrderDetailView from './features/buyOrders/views/BuyOrderDetailView';
import BuyOrderEditView from './features/buyOrders/views/BuyOrderEditView';
import StoreProductListView from './features/storeProduct/views/StoreProductListView';
import StoreProductCreateView from './features/storeProduct/views/StoreProductCreateView';
import StoreProductDetailView from './features/storeProduct/views/StoreProductDetailView';
import StoreProductEditView from './features/storeProduct/views/StoreProductEditView';
import StoresListView from './features/stores/views/StoresListView';

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/',
        Component: LoginView,
        handle: { title: LoginAreaText },
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    path: '/dashboard',
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            handle: { title: WelcomeAreaText },
            children: [{ index: true, Component: WelcomeView }],
          },
          //Profile view...
          {
            path: 'profile',
            handle: { title: ProfileAreaText },
            children: [{ index: true, Component: ProfileView }],
          },
          //Buy order routes...
          {
            path: 'buy-order',
            children: [
              {
                element: <AbilityRoute />,
                handle: {
                  title: BuyOrdersListAreaText,
                  abilities: ['sys:admin', 'buyOrder:index'],
                },
                children: [{ index: true, Component: BuyOrderListView }],
              },
              {
                path: 'create',
                element: <AbilityRoute />,
                handle: {
                  title: CreateBuyOrderAreaText,
                  abilities: ['sys:admin', 'buyOrder:store'],
                },
                children: [{ index: true, Component: BuyOrderCreateView }],
              },
              {
                path: ':id',
                element: <AbilityRoute />,
                handle: {
                  title: BuyOrderDetailAreaText,
                  abilities: ['sys:admin', 'buyOrder:detail'],
                },
                children: [{ index: true, Component: BuyOrderDetailView }],
              },
              {
                path: ':id/edit',
                element: <AbilityRoute />,
                handle: { title: EditBuyOrderAreaText, abilities: ['sys:admin', 'buyOrder:edit'] },
                children: [{ index: true, Component: BuyOrderEditView }],
              },
            ],
          },
          //Customer routes...
          {
            path: 'customer',
            children: [
              {
                element: <AbilityRoute />,
                handle: {
                  title: CustomersListAreaText,
                  abilities: ['sys:admin', 'customer:index'],
                },
                children: [{ index: true, Component: CustomerListView }],
              },
              {
                path: 'create',
                element: <AbilityRoute />,
                handle: {
                  title: CreateCustomerAreaText,
                  abilities: ['sys:admin', 'customer:store'],
                },
                children: [{ index: true, Component: CustomerCreateView }],
              },
              {
                path: ':id',
                element: <AbilityRoute />,
                handle: {
                  title: CustomerDetailAreaText,
                  abilities: ['sys:admin', 'customer:detail'],
                },
                children: [{ index: true, Component: CustomerDetailView }],
              },
              {
                path: ':id/edit',
                element: <AbilityRoute />,
                handle: { title: EditCustomerAreaText, abilities: ['sys:admin', 'customer:edit'] },
                children: [{ index: true, Component: CustomerEditView }],
              },
            ],
          },
          //Supplier routes...
          {
            path: 'supplier',
            children: [
              {
                element: <AbilityRoute />,
                handle: {
                  title: SuppliersListAreaText,
                  abilities: ['sys:admin', 'supplier:index'],
                },
                children: [{ index: true, Component: SuppliersListView }],
              },
              {
                path: 'create',
                element: <AbilityRoute />,
                handle: {
                  title: CreateSupplierAreaText,
                  abilities: ['sys:admin', 'supplier:store'],
                },
                children: [{ index: true, Component: SupplierCreateView }],
              },
              {
                path: ':id',
                element: <AbilityRoute />,
                handle: {
                  title: SupplierDetailAreaText,
                  abilities: ['sys:admin', 'supplier:detail'],
                },
                children: [{ index: true, Component: SupplierDetailView }],
              },
              {
                path: ':id/edit',
                element: <AbilityRoute />,
                handle: { title: EditSupplierAreaText, abilities: ['sys:admin', 'supplier:edit'] },
                children: [{ index: true, Component: SupplierEditView }],
              },
            ],
          },
          //Store routes...
          {
            path: 'store',
            children: [
              {
                element: <AbilityRoute />,
                handle: {
                  title: StoresListAreaText,
                  abilities: ['sys:admin', 'store:index'],
                },
                children: [{ index: true, Component: StoresListView }],
              },
            ],
          },
          //StoreProduct routes...
          {
            path: 'store-product',
            children: [
              {
                element: <AbilityRoute />,
                handle: {
                  title: StoreProductsListAreaText,
                  abilities: ['sys:admin', 'storeProduct:index'],
                },
                children: [{ index: true, Component: StoreProductListView }],
              },
              {
                path: 'create',
                element: <AbilityRoute />,
                handle: {
                  title: StoreProductCreateAreaText,
                  abilities: ['sys:admin', 'storeProduct:store'],
                },
                children: [{ index: true, Component: StoreProductCreateView }],
              },
              {
                path: ':storeId/:productId',
                element: <AbilityRoute />,
                handle: {
                  title: StoreProductDetailAreaText,
                  abilities: ['sys:admin', 'storeProduct:detail'],
                },
                children: [{ index: true, Component: StoreProductDetailView }],
              },
              {
                path: ':storeId/:productId/edit',
                element: <AbilityRoute />,
                handle: {
                  title: StoreProductEditAreaText,
                  abilities: ['sys:admin', 'storeProduct:edit'],
                },
                children: [{ index: true, Component: StoreProductEditView }],
              },
            ],
          },
          //Presentation routes...
          {
            path: 'presentation',
            children: [
              {
                element: <AbilityRoute />,
                handle: {
                  title: PresentationsListAreaText,
                  abilities: ['sys:admin', 'presentation:index'],
                },
                children: [{ index: true, Component: PresentationsListView }],
              },
            ],
          },
          //Product routes...
          {
            path: 'product',
            children: [
              {
                element: <AbilityRoute />,
                handle: { title: ProductsListAreaText, abilities: ['sys:admin', 'product:index'] },
                children: [{ index: true, Component: ProductsListView }],
              },
              {
                path: 'create',
                element: <AbilityRoute />,
                handle: {
                  title: CreateProductAreaText,
                  abilities: ['sys:admin', 'product:store'],
                },
                children: [{ index: true, Component: ProductCreateView }],
              },
              {
                path: ':id',
                element: <AbilityRoute />,
                handle: {
                  title: ProductDetailAreaText,
                  abilities: ['sys:admin', 'product:detail'],
                },
                children: [{ index: true, Component: ProductDetailView }],
              },
              {
                path: ':id/edit',
                element: <AbilityRoute />,
                handle: { title: EditProductAreaText, abilities: ['sys:admin', 'product:edit'] },
                children: [{ index: true, Component: ProductEditView }],
              },
            ],
          },
          //Role routes...
          {
            path: 'role',
            children: [
              {
                element: <AbilityRoute />,
                handle: { title: RolesListAreaText, abilities: ['sys:admin', 'role:index'] },
                children: [{ index: true, Component: RolesListView }],
              },
              {
                path: 'create',
                element: <AbilityRoute />,
                handle: {
                  title: CreateRoleAreaText,
                  abilities: ['sys:admin', 'role:store'],
                },
                children: [{ index: true, Component: RoleCreateView }],
              },
              {
                path: ':id',
                element: <AbilityRoute />,
                handle: {
                  title: RoleDetailAreaText,
                  abilities: ['sys:admin', 'role:detail'],
                },
                children: [{ index: true, Component: RoleDetailView }],
              },
              {
                path: ':id/edit',
                element: <AbilityRoute />,
                handle: { title: EditRoleAreaText, abilities: ['sys:admin', 'role:edit'] },
                children: [{ index: true, Component: RoleEditView }],
              },
            ],
          },
          //Ability Routes...
          {
            path: 'ability',
            children: [
              {
                element: <AbilityRoute />,
                handle: { title: AbilitiesListAreaText, abilities: ['sys:admin', 'ability:index'] },
                children: [{ index: true, Component: AbilitiesListView }],
              },
            ],
          },
          //Settings routes...
          {
            path: 'settings',
            children: [
              {
                element: <AbilityRoute />,
                handle: { title: SettingsListAreaText, abilities: ['sys:admin', 'settings:index'] },
                children: [{ index: true, Component: SettingsListView }],
              },
            ],
          },
          //User routes...
          {
            path: 'user',
            children: [
              {
                element: <AbilityRoute />,
                handle: { title: UsersListAreaText, abilities: ['sys:admin', 'user:index'] },
                children: [{ index: true, Component: UsersListView }],
              },
              {
                path: ':id',
                element: <AbilityRoute />,
                handle: { title: UserDetailAreaText, abilities: ['sys:admin', 'user:detail'] },
                children: [{ index: true, Component: UserDetailView }],
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <ProtectedRoute></ProtectedRoute>,
        children: [
          {
            element: <DashboardLayout></DashboardLayout>,
            handle: { title: _404AreaText },
            children: [{ path: '*', Component: ViewNotFound }],
          },
        ],
      },
    ],
  },
]);
