import { Navigate, Outlet } from 'react-router';
import Cookies from 'js-cookie';
import { TitleSync } from '~/components/TitleSync';

export default function GuestRoute() {
  const token = Cookies.get('AUTH_TOKEN');

  if (token) return <Navigate to='/dashboard' replace />;

  return (
    <>
      <TitleSync></TitleSync>
      <Outlet></Outlet>
    </>
  );
}
