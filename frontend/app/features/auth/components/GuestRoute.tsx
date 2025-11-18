import { Navigate, Outlet } from 'react-router';
import Cookies from 'js-cookie';

export default function GuestRoute() {
  const token = Cookies.get('AUTH_TOKEN');

  if (token) return <Navigate to='/dashboard' replace />;

  return <Outlet />;
}
