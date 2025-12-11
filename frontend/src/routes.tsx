import { createBrowserRouter } from 'react-router';
import LoginView from './features/auth/views/LoginView';
import GuestRoute from './features/auth/components/GuestRoute';
import {
  CreateCustomerAreaText,
  CreateSupplierAreaText,
  CustomerDetailAreaText,
  CustomersListAreaText,
  EditCustomerAreaText,
  EditSupplierAreaText,
  LoginAreaText,
  ProfileAreaText,
  RolesListAreaText,
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
                  abilities: ['sys:admin', 'customer:create'],
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
                  abilities: ['sys:admin', 'supplier:create'],
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
          {
            path: 'role',
            children: [
              {
                element: <AbilityRoute></AbilityRoute>,
                handle: { title: RolesListAreaText, abilities: ['sys:admin', 'role:index'] },
                children: [{ index: true, Component: RolesListView }],
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
