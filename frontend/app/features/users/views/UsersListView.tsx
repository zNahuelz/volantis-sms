import type { Route } from '.react-router/types/app/+types/root';
import { UsersListAreaText } from '~/constants/strings';

export function meta({}: Route.MetaArgs) {
  return [{ title: UsersListAreaText }];
}

export default function UsersListView() {
  return (
    <div>
      <h1>Hello users list view</h1>
    </div>
  );
}
