import { Navigate, Outlet } from 'react-router';
import { TitleSync } from '~/components/TitleSync';
import { useAuth } from '~/context/authContext';

export default function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to='/' replace />;
  }

  return (
    <>
      <TitleSync></TitleSync>
      <Outlet></Outlet>
    </>
  );
}
