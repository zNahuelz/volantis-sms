import { useMatches, Navigate, Outlet } from 'react-router';
import { TitleSync } from '~/components/TitleSync';
import { useAuth } from '~/context/authContext';

export function AbilityRoute() {
  const { token, abilities: userAbilities } = useAuth();
  const matches = useMatches();

  if (!token) {
    return <Navigate to='/' replace />;
  }

  const current = [...matches].reverse().find((m) => m.handle?.abilities);

  const required = current?.handle?.abilities || [];

  const userKeys = (userAbilities || []).map((a) => a.key);

  const allowed = userKeys.includes('sys:admin') || required.some((req) => userKeys.includes(req));

  if (!allowed) {
    return <Navigate to='/dashboard' replace />;
  }

  return (
    <>
      <TitleSync></TitleSync>
      <Outlet></Outlet>
    </>
  );
}
