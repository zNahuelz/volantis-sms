import { Table, type Column } from '~/components/Table';
import {
  DniText,
  IdText,
  NamesText,
  StateText,
  SurnamesText,
  UpdatedAtText,
  UsernameText,
  UsersNotLoaded,
} from '~/constants/strings';
import type { User } from '~/types/user';

type Props = {
  data: User[];
  actions: (row: User) => React.ReactNode;
};

export default function UserTable({ data, actions }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'names', label: NamesText },
    { key: 'surnames', label: SurnamesText },
    { key: 'username', label: UsernameText },
    { key: 'dni', label: DniText.toUpperCase() },
    { key: 'updatedAt', label: UpdatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<User>[];

  return <Table columns={columns} data={data} actions={actions} errorMessage={UsersNotLoaded} />;
}
