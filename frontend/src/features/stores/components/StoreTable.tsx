import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  FetchFailedText,
  IdText,
  NameText,
  PhoneText,
  RucText,
  StateText,
  StoresNotLoadedText,
  UpdatedAtText,
} from '~/constants/strings';
import type { Store } from '~/types/store';

type Props = {
  data: Store[];
  actions: (row: Store) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function StoreTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'name', label: NameText },
    { key: 'ruc', label: RucText.toUpperCase() },
    { key: 'phone', label: PhoneText },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'updatedAt', label: UpdatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<Store>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : StoresNotLoadedText}
    />
  );
}
