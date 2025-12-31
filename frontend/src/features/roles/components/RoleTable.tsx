import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  FetchFailedText,
  IdText,
  NameText,
  RolesNotLoadedText,
  StateText,
  UpdatedAtText,
} from '~/constants/strings';
import type { Role } from '~/types/role';

type Props = {
  data: Role[];
  actions: (row: Role) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function RoleTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'name', label: NameText },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'updatedAt', label: UpdatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<Role>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : RolesNotLoadedText}
    />
  );
}
