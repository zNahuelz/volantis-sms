import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route('/', 'features/auth/components/GuestRoute.tsx', [
    index('features/auth/views/LoginView.tsx'),
  ]),

  route('/dashboard', 'features/auth/components/ProtectedRoute.tsx', [
    route('', 'layouts/DashboardLayout.tsx', [
      route('', 'routes/home.tsx'),

      route('supplier', 'features/suppliers/views/SuppliersListView.tsx'),
      route(
        'supplier/create',
        'features/suppliers/views/SupplierCreateView.tsx',
      ),
      route('supplier/:id', 'features/suppliers/views/SupplierDetailView.tsx'),
      route(
        'supplier/:id/edit',
        'features/suppliers/views/SupplierEditView.tsx',
      ),
    ]),
  ]),
] satisfies RouteConfig;
