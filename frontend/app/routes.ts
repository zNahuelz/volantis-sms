import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route('/', 'features/auth/components/GuestRoute.tsx', [
    index('features/auth/views/LoginView.tsx'),
  ]),

  route('/dashboard', 'features/auth/components/ProtectedRoute.tsx', [
    route('', 'layouts/DashboardLayout.tsx', [
      route('', 'features/shared/views/WelcomeView.tsx'),

      route('profile', 'features/auth/views/ProfileView.tsx'),

      route('customer', 'features/customers/views/CustomersListView.tsx'),
      route('customer/create', 'features/customers/views/CustomerCreateView.tsx'),
      route('customer/:id', 'features/customers/views/CustomerDetailView.tsx'),
      route('customer/:id/edit', 'features/customers/views/CustomerEditView.tsx'),

      route('supplier', 'features/suppliers/views/SuppliersListView.tsx'),
      route('supplier/create', 'features/suppliers/views/SupplierCreateView.tsx'),
      route('supplier/:id', 'features/suppliers/views/SupplierDetailView.tsx'),
      route('supplier/:id/edit', 'features/suppliers/views/SupplierEditView.tsx'),

      route('user', 'features/users/views/UsersListView.tsx'),
      route('user/:id', 'features/users/views/UserDetailView.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
